import { useState, useEffect, useCallback } from 'react';
import { isOnline as getIsOnline, subscribe as networkSubscribe } from 'expo-network';
import { getPendingChangesCount } from '../src/shared/db';
import { triggerSyncNow, isSyncing } from '../src/shared/sync';

// Simple pub/sub for cache invalidation
type InvalidateFn = () => void;
const listeners = new Set<InvalidateFn>();

export const invalidate = () => {
  listeners.forEach((fn) => fn());
};

export const useInvalidate = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const cb = () => setTick(t => t + 1);
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);
  return tick;
};

// Network state hook
export const useNetworkState = () => {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    const init = async () => {
      const state = await getIsOnline();
      setOnline(!!state);
      unsub = networkSubscribe((state) => setOnline(!!state.isOnline));
    };
    init();
    return () => unsub?.();
  }, []);

  return { isOnline: online };
};

// Sync status hook
export const useSyncStatus = () => {
  const tick = useInvalidate();
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    getPendingChangesCount().then(setPending);
    const interval = setInterval(() => {
      getPendingChangesCount().then(setPending);
      setSyncing(isSyncing());
    }, 5000);
    return () => clearInterval(interval);
  }, [tick]);

  return { pending, syncing, triggerSync: triggerSyncNow };
};

// Pending changes banner helper
export const usePendingOfflineChanges = () => {
  const { pending } = useSyncStatus();
  return { hasPending: pending > 0, count: pending };
};