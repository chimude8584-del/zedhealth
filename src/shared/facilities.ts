import { getDb } from './db';
import type { Facility, Province } from './types';

const SEED_FACILITIES: Omit<Facility, 'uuid'>[] = [
  {
    name: 'University Teaching Hospital',
    province: 'Lusaka' as Province,
    district: 'Lusaka',
    phone: '+260 211 251 251',
    isNhimaAccredited: true,
    hasYouthFriendlyServices: true,
    latitude: -15.4167,
    longitude: 28.2833,
  },
  {
    name: 'Levy Mwanawasa General Hospital',
    province: 'Lusaka' as Province,
    district: 'Lusaka',
    phone: '+260 211 368 000',
    isNhimaAccredited: true,
    hasYouthFriendlyServices: true,
    latitude: -15.4500,
    longitude: 28.3000,
  },
  {
    name: 'Ndola Central Hospital',
    province: 'Copperbelt' as Province,
    district: 'Ndola',
    phone: '+260 212 612 345',
    isNhimaAccredited: true,
    hasYouthFriendlyServices: true,
    latitude: -12.9767,
    longitude: 28.6372,
  },
  // TODO: Replace with full NHIMA accredited facility list
];

export const seedFacilities = async (): Promise<void> => {
  const db = getDb();
  if (!db) return;

  const existing = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM facilities'
  );
  if (existing && existing.count > 0) return;

  for (const facility of SEED_FACILITIES) {
    const uuid = `fac-${Buffer.from(facility.name).toString('base64').slice(0, 8)}`;
    await db.runAsync(
      `INSERT OR IGNORE INTO facilities 
       (uuid, name, province, district, phone, isNhimaAccredited, hasYouthFriendlyServices, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        facility.name,
        facility.province,
        facility.district,
        facility.phone || null,
        facility.isNhimaAccredited ? 1 : 0,
        facility.hasYouthFriendlyServices ? 1 : 0,
        facility.latitude || null,
        facility.longitude || null,
      ]
    );
  }

  console.log(`✅ Seeded ${SEED_FACILITIES.length} facilities`);
};

export const getAllFacilities = async (): Promise<Facility[]> => {
  const db = getDb();
  if (!db) return [];

  const rows = await db.getAllAsync<any>(
    'SELECT * FROM facilities ORDER BY province, name'
  );

  return rows.map((r) => ({
    ...r,
    isNhimaAccredited: Boolean(r.isNhimaAccredited),
    hasYouthFriendlyServices: Boolean(r.hasYouthFriendlyServices),
  }));
};

export const getFacilitiesByProvince = async (province: string): Promise<Facility[]> => {
  const db = getDb();
  if (!db) return [];

  const rows = await db.getAllAsync<any>(
    'SELECT * FROM facilities WHERE province = ? ORDER BY name',
    [province]
  );

  return rows.map((r) => ({
    ...r,
    isNhimaAccredited: Boolean(r.isNhimaAccredited),
    hasYouthFriendlyServices: Boolean(r.hasYouthFriendlyServices),
  }));
};