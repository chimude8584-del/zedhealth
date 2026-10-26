import { getDb } from './db';
import { API_BASE_URL } from '../config';
import { isOnline } from 'expo-network';

let syncRunning = false;
let syncInterval: NodeJS.Timeout | null = null;
const SYNC_INTERVAL_MS = 30000; // every 30 seconds

export const isSyncing = () => syncRunning;

export const startSyncLoop = () => {
  if (syncInterval) return;

  syncLoop(); // run immediately
  syncInterval = setInterval(syncLoop, SYNC_INTERVAL_MS);
  console.log('✅ Sync loop started');
};

export const stopSyncLoop = () => {
  if (syncInterval) clearInterval(syncInterval);
  syncInterval = null;
};

export const syncLoop = async () => {
  if (syncRunning) return;

  const online = await isOnline();
  if (!online) return;

  syncRunning = true;
  try {
    await pushPending();
    await pullUpdates();
  } catch (err) {
    console.warn('Sync error:', err);
  } finally {
    syncRunning = false;
  }
};

const pushPending = async () => {
  const db = getDb();
  if (!db) return;

  const pending = await db.getAllAsync<{
    id: number;
    tableName: string;
    recordUuid: string;
    operation: string;
  }>('SELECT * FROM sync_queue ORDER BY id ASC LIMIT 50');

  for (const item of pending) {
    try {
      const res = await fetch(`${API_BASE_URL}/sync/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (res.ok) {
        await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [item.id]);
        await db.runAsync(
          `UPDATE ${item.tableName} SET synced = 1 WHERE uuid = ?`,
          [item.recordUuid]
        );
      } else if (res.status === 409) {
        // Conflict — clinician data takes priority
        await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [item.id]);
        await pullUpdates(); // refresh from server
      }
    } catch (pushErr) {
      console.warn(`Push failed for ${item.tableName}:${item.recordUuid}`, pushErr);
    }
  }
};

const pullUpdates = async () => {
  const db = getDb();
  if (!db) return;

  const cursorRow = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM sync_meta WHERE key = 'last_pull_cursor'"
  );
  const cursor = cursorRow?.value || '0';

  try {
    const res = await fetch(`${API_BASE_URL}/sync/pull?cursor=${encodeURIComponent(cursor)}`);
    if (!res.ok) return;

    const data = await res.json();
    const records = data.records || [];

    for (const rec of records) {
      const table = rec._table;
      const uuid = rec.uuid;
      if (!table || !uuid) continue;

      const cols = Object.keys(rec).filter((k) => !k.startsWith('_'));
      const vals = cols.map((k) => rec[k]);
      const placeholders = cols.map(() => '?').join(', ');

      await db.runAsync(
        `INSERT OR REPLACE INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`,
        vals
      );
    }

    if (data.nextCursor) {
      await db.runAsync(
        "INSERT OR REPLACE INTO sync_meta (key, value) VALUES ('last_pull_cursor', ?)",
        [data.nextCursor]
      );
    }
  } catch (pullErr) {
    console.warn('Pull failed:', pullErr);
  }
};

export const triggerSyncNow = () => syncLoop();