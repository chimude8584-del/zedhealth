import { useState, useEffect, useCallback } from 'react';
import { getDb, upsertWithSync } from '../src/shared/db';
import { invalidate } from './core';
import { v4 as uuidv4 } from 'uuid';

export const useAnonymousQA = (deviceHash: string) => {
  const [myQuestions, setMyQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (!deviceHash) return;
    const load = async () => {
      const db = getDb();
      if (!db) return;
      const rows = await db.getAllAsync<any>(
        `SELECT * FROM questions WHERE deviceHash = ? AND deletedAt IS NULL ORDER BY createdAt DESC`,
        [deviceHash]
      );
      setMyQuestions(rows);
    };
    load();
  }, [deviceHash]);

  const submit = useCallback(async (body: string, topic = 'general') => {
    const now = new Date().toISOString();
    await upsertWithSync('questions', {
      uuid: uuidv4(), deviceHash, topic, body, isAnon: 1, createdAt: now, updatedAt: now
    });
    invalidate();
  }, [deviceHash]);

  const answersFor = useCallback((qUuid: string) => {
    const q = myQuestions.find(item => item.uuid === qUuid);
    return q?.answer || null;
  }, [myQuestions]);

  return { myQuestions, submit, answersFor };
};

export const useCycleTracker = (deviceHash: string) => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!deviceHash) return;
    const load = async () => {
      const db = getDb();
      if (!db) return;
      const rows = await db.getAllAsync<any>(
        `SELECT * FROM cycle_logs WHERE deviceHash = ? AND deletedAt IS NULL ORDER BY startDate DESC`,
        [deviceHash]
      );
      setHistory(rows);
    };
    load();
  }, [deviceHash]);

  const log = useCallback(async (startDate: string, notes?: string) => {
    const now = new Date().toISOString();
    await upsertWithSync('cycle_logs', {
      uuid: uuidv4(), deviceHash, startDate, notes, createdAt: now, updatedAt: now
    });
    invalidate();
  }, [deviceHash]);

  const averageCycleLength = history.length >= 2
    ? Math.round(history.slice(0, 5).reduce((sum, item, idx, arr) => {
        if (idx === 0) return 0;
        const prev = arr[idx - 1];
        return sum + (new Date(item.startDate).getTime() - new Date(prev.startDate).getTime()) / (1000 * 60 * 60 * 24);
      }, 0) / (history.length - 1))
    : 28;

  const predictedNext = history.length > 0
    ? new Date(new Date(history[0].startDate).getTime() + averageCycleLength * 86400000).toISOString().split('T')[0]
    : null;

  return { history, log, averageCycleLength, predictedNext };
};

export const useSelfTest = () => {
  const generateCode = useCallback(() => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }, []);
  return { generateCode };
};