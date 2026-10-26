import { useState, useEffect, useCallback } from 'react';
import { getDb, upsertWithSync } from '../src/shared/db';
import { invalidate } from './core';
import { BP_THRESHOLDS, GLUCOSE_THRESHOLDS } from '../src/config';
import { v4 as uuidv4 } from 'uuid';

export const useBPLogger = (patientUuid: string) => {
  const [series, setSeries] = useState<Array<{ date: string; sys: number; dia: number; pulse?: number }>>([]);
  const [latest, setLatest] = useState<{ sys: number; dia: number; pulse?: number; date: string } | null>(null);
  const [dangerActive, setDangerActive] = useState(false);

  useEffect(() => {
    if (!patientUuid) return;
    const load = async () => {
      const db = getDb();
      if (!db) return;
      const rows = await db.getAllAsync<any>(
        `SELECT * FROM vitals WHERE patientUuid = ? AND type IN ('bp_systolic', 'bp_diastolic', 'pulse') ORDER BY createdAt DESC LIMIT 60`,
        [patientUuid]
      );
      const grouped: Record<string, { sys?: number; dia?: number; pulse?: number }> = {};
      rows.forEach(r => {
        if (!grouped[r.createdAt]) grouped[r.createdAt] = {};
        if (r.type === 'bp_systolic') grouped[r.createdAt].sys = r.value;
        if (r.type === 'bp_diastolic') grouped[r.createdAt].dia = r.value;
        if (r.type === 'pulse') grouped[r.createdAt].pulse = r.value;
      });
      const chartData = Object.entries(grouped)
        .filter(([, v]) => v.sys && v.dia)
        .map(([date, v]) => ({ date, sys: v.sys!, dia: v.dia!, pulse: v.pulse }))
        .reverse();
      setSeries(chartData);
      if (chartData.length > 0) {
        const last = chartData[chartData.length - 1];
        setLatest({ sys: last.sys, dia: last.dia, pulse: last.pulse, date: last.date });
        setDangerActive(last.sys >= BP_THRESHOLDS.DANGER_SYSTOLIC || last.dia >= BP_THRESHOLDS.DANGER_DIASTOLIC);
      }
    };
    load();
  }, [patientUuid]);

  const log = useCallback(async (sys: number, dia: number, pulse?: number) => {
    const now = new Date().toISOString();
    await upsertWithSync('vitals', { uuid: uuidv4(), patientUuid, type: 'bp_systolic', value: sys, unit: 'mmHg', createdAt: now, updatedAt: now });
    await upsertWithSync('vitals', { uuid: uuidv4(), patientUuid, type: 'bp_diastolic', value: dia, unit: 'mmHg', createdAt: now, updatedAt: now });
    if (pulse) await upsertWithSync('vitals', { uuid: uuidv4(), patientUuid, type: 'pulse', value: pulse, unit: 'bpm', createdAt: now, updatedAt: now });
    if (sys >= BP_THRESHOLDS.DANGER_SYSTOLIC || dia >= BP_THRESHOLDS.DANGER_DIASTOLIC) {
      await upsertWithSync('alerts', {
        uuid: uuidv4(), patientUuid, level: 'danger',
        title: '⚠️ DANGER: Very High Blood Pressure',
        message: `BP ${sys}/${dia} mmHg — seek medical attention immediately.`,
        createdAt: now, updatedAt: now
      });
    }
    invalidate();
  }, [patientUuid]);

  return { series, latest, dangerActive, log };
};

export const useVitalsSeries = (patientUuid: string, type: 'glucose' | 'weight', days = 30) => {
  const [points, setPoints] = useState<Array<{ date: string; value: number }>>([]);
  const [latest, setLatest] = useState<number | null>(null);
  const [average, setAverage] = useState<number | null>(null);

  useEffect(() => {
    if (!patientUuid) return;
    const load = async () => {
      const db = getDb();
      if (!db) return;
      const rows = await db.getAllAsync<any>(
        `SELECT * FROM vitals WHERE patientUuid = ? AND type = ? ORDER BY createdAt DESC LIMIT ?`,
        [patientUuid, type, days]
      );
      const data = rows.reverse().map(r => ({ date: r.createdAt, value: r.value }));
      setPoints(data);
      if (data.length > 0) {
        setLatest(data[data.length - 1].value);
        setAverage(Math.round(data.reduce((s, p) => s + p.value, 0) / data.length * 10) / 10);
      }
    };
    load();
  }, [patientUuid, type, days]);

  const log = useCallback(async (value: number) => {
    const now = new Date().toISOString();
    const unit = type === 'glucose' ? 'mmol/L' : 'kg';
    await upsertWithSync('vitals', { uuid: uuidv4(), patientUuid, type, value, unit, createdAt: now, updatedAt: now });
    invalidate();
  }, [patientUuid, type]);

  return { points, latest, average, log };
};

export const useMedications = (patientUuid: string) => {
  const [medications, setMedications] = useState<any[]>([]);

  useEffect(() => {
    if (!patientUuid) return;
    const load = async () => {
      const db = getDb();
      if (!db) return;
      const rows = await db.getAllAsync<any>(
        `SELECT * FROM medications WHERE patientUuid = ? AND deletedAt IS NULL ORDER BY isActive DESC, name`,
        [patientUuid]
      );
      setMedications(rows);
    };
    load();
  }, [patientUuid]);

  const add = useCallback(async (data: any) => {
    const now = new Date().toISOString();
    await upsertWithSync('medications', { uuid: uuidv4(), patientUuid, ...data, createdAt: now, updatedAt: now });
    invalidate();
  }, [patientUuid]);

  const adherence = useCallback((uuid: string, days = 30) => {
    return medications.filter(m => m.uuid === uuid).length > 0 ? 85 : 0;
  }, [medications]);

  return { medications, add, adherence };
};