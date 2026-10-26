import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const DB_NAME = 'zedhealth_v1.db';
let db: SQLite.SQLiteDatabase | null = null;

export const getDb = () => db;

export const initDatabase = async (): Promise<void> => {
  if (db) return;

  db = await SQLite.openDatabaseAsync(DB_NAME);

  await db.execAsync(`
    -- Patients (Nsansa)
    CREATE TABLE IF NOT EXISTS patients (
      uuid TEXT PRIMARY KEY,
      phone TEXT NOT NULL UNIQUE,
      displayName TEXT,
      dateOfBirth TEXT,
      sex TEXT,
      preferredLang TEXT NOT NULL DEFAULT 'en',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      deletedAt TEXT,
      synced INTEGER NOT NULL DEFAULT 0
    );

    -- Vitals Readings
    CREATE TABLE IF NOT EXISTS vitals (
      uuid TEXT PRIMARY KEY,
      patientUuid TEXT NOT NULL REFERENCES patients(uuid),
      type TEXT NOT NULL,
      value REAL NOT NULL,
      unit TEXT NOT NULL,
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      deletedAt TEXT,
      synced INTEGER NOT NULL DEFAULT 0
    );

    -- Medications
    CREATE TABLE IF NOT EXISTS medications (
      uuid TEXT PRIMARY KEY,
      patientUuid TEXT NOT NULL REFERENCES patients(uuid),
      name TEXT NOT NULL,
      dosage TEXT NOT NULL,
      frequency TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT,
      isActive INTEGER NOT NULL DEFAULT 1,
      reminderEnabled INTEGER NOT NULL DEFAULT 1,
      reminderTimes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      deletedAt TEXT,
      synced INTEGER NOT NULL DEFAULT 0
    );

    -- Appointments
    CREATE TABLE IF NOT EXISTS appointments (
      uuid TEXT PRIMARY KEY,
      patientUuid TEXT NOT NULL REFERENCES patients(uuid),
      facilityUuid TEXT NOT NULL,
      scheduledAt TEXT NOT NULL,
      purpose TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'scheduled',
      reminderSent INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      deletedAt TEXT,
      synced INTEGER NOT NULL DEFAULT 0
    );

    -- Alerts
    CREATE TABLE IF NOT EXISTS alerts (
      uuid TEXT PRIMARY KEY,
      patientUuid TEXT NOT NULL REFERENCES patients(uuid),
      level TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      acknowledgedAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      deletedAt TEXT,
      synced INTEGER NOT NULL DEFAULT 0
    );

    -- Anonymous Users (YouthConnect)
    CREATE TABLE IF NOT EXISTS anon_users (
      deviceHash TEXT PRIMARY KEY,
      preferredLang TEXT NOT NULL DEFAULT 'en',
      cycleDataSyncOptIn INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    );

    -- Questions
    CREATE TABLE IF NOT EXISTS questions (
      uuid TEXT PRIMARY KEY,
      deviceHash TEXT NOT NULL,
      topic TEXT NOT NULL,
      body TEXT NOT NULL,
      isAnon INTEGER NOT NULL DEFAULT 1,
      answer TEXT,
      answeredAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      deletedAt TEXT,
      synced INTEGER NOT NULL DEFAULT 0
    );

    -- Cycle Logs
    CREATE TABLE IF NOT EXISTS cycle_logs (
      uuid TEXT PRIMARY KEY,
      deviceHash TEXT NOT NULL,
      startDate TEXT NOT NULL,
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      deletedAt TEXT,
      synced INTEGER NOT NULL DEFAULT 0
    );

    -- Facilities
    CREATE TABLE IF NOT EXISTS facilities (
      uuid TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      province TEXT NOT NULL,
      district TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      isNhimaAccredited INTEGER NOT NULL DEFAULT 0,
      hasYouthFriendlyServices INTEGER NOT NULL DEFAULT 0,
      latitude REAL,
      longitude REAL
    );

    -- Pending Sync Queue
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tableName TEXT NOT NULL,
      recordUuid TEXT NOT NULL,
      operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
      attemptedAt TEXT,
      error TEXT
    );

    -- Sync Metadata
    CREATE TABLE IF NOT EXISTS sync_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  console.log('✅ Database initialized');
};

export const upsertWithSync = async (
  tableName: string,
  record: Record<string, any>,
  uuidField = 'uuid'
): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  const now = new Date().toISOString();
  const recordWithTimestamps = {
    ...record,
    updatedAt: now,
    createdAt: record.createdAt || now,
    synced: 0,
  };

  const columns = Object.keys(recordWithTimestamps);
  const placeholders = columns.map(() => '?').join(', ');
  const values = columns.map((col) => recordWithTimestamps[col]);

  await db.runAsync(
    `INSERT OR REPLACE INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`,
    values
  );

  await db.runAsync(
    `INSERT INTO sync_queue (tableName, recordUuid, operation) VALUES (?, ?, ?)`,
    [tableName, recordWithTimestamps[uuidField], 'INSERT']
  );
};

export const softDelete = async (tableName: string, uuid: string): Promise<void> => {
  if (!db) throw new Error('Database not initialized');
  const now = new Date().toISOString();

  await db.runAsync(
    `UPDATE ${tableName} SET deletedAt = ?, synced = 0 WHERE uuid = ? AND deletedAt IS NULL`,
    [now, uuid]
  );

  await db.runAsync(
    `INSERT INTO sync_queue (tableName, recordUuid, operation) VALUES (?, ?, ?)`,
    [tableName, uuid, 'DELETE']
  );
};

export const getPendingChangesCount = async (): Promise<number> => {
  if (!db) return 0;
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM sync_queue'
  );
  return result?.count || 0;
};

export const clearSynced = async (): Promise<void> => {
  if (!db) return;
  await db.runAsync('DELETE FROM sync_queue WHERE id NOT IN (SELECT id FROM sync_queue LIMIT 0)');
};