export interface Syncable {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  synced: number; // 0 = pending, 1 = synced, -1 = conflict
}

export enum Province {
  LUSAKA = 'Lusaka',
  COPPERBELT = 'Copperbelt',
  CENTRAL = 'Central',
  EASTERN = 'Eastern',
  NORTHERN = 'Northern',
  SOUTHERN = 'Southern',
  WESTERN = 'Western',
  NORTH_WESTERN = 'North-Western',
  MUCHINGA = 'Muchinga',
}

export interface Facility {
  uuid: string;
  name: string;
  province: Province;
  district: string;
  address?: string;
  phone?: string;
  isNhimaAccredited: boolean;
  hasYouthFriendlyServices: boolean;
  latitude?: number;
  longitude?: number;
}

export interface Patient extends Syncable {
  phone: string;
  displayName?: string;
  dateOfBirth?: string;
  sex?: 'male' | 'female' | 'other';
  preferredLang: 'en' | 'ny' | 'bem' | 'ton';
}

export interface VitalsReading extends Syncable {
  patientUuid: string;
  type: 'bp_systolic' | 'bp_diastolic' | 'glucose' | 'weight' | 'pulse';
  value: number;
  unit: string;
  notes?: string;
}

export interface Medication extends Syncable {
  patientUuid: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  reminderEnabled: boolean;
  reminderTimes?: string[];
}

export interface Appointment extends Syncable {
  patientUuid: string;
  facilityUuid: string;
  scheduledAt: string;
  purpose: string;
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled';
  reminderSent: boolean;
}

export interface Alert extends Syncable {
  patientUuid: string;
  level: 'info' | 'warning' | 'danger';
  title: string;
  message: string;
  acknowledgedAt?: string;
}

export interface AnonUser {
  deviceHash: string;
  preferredLang: 'en' | 'ny' | 'bem' | 'ton';
  createdAt: string;
  cycleDataSyncOptIn: boolean;
}

export interface Question extends Syncable {
  deviceHash: string;
  topic: string;
  body: string;
  isAnon: boolean;
  answer?: string;
  answeredAt?: string;
}

export interface CycleLog extends Syncable {
  deviceHash: string;
  startDate: string;
  notes?: string;
}