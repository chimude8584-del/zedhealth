export const API_BASE_URL = 'http://localhost:4000';
export const APP_VERSION = '1.2.0';
export const SUPPORTED_LANGUAGES = ['en', 'ny', 'bem', 'ton'] as const;
export const DEFAULT_LANGUAGE = 'en';

// Clinical thresholds aligned with MoH / WHO guidelines
export const BP_THRESHOLDS = {
  DANGER_SYSTOLIC: 180,
  DANGER_DIASTOLIC: 120,
  ELEVATED_SYSTOLIC: 140,
  ELEVATED_DIASTOLIC: 90,
} as const;

export const GLUCOSE_THRESHOLDS = {
  FASTING_NORMAL_MAX: 5.5,
  FASTING_PRE_MAX: 6.9,
  RANDOM_DANGER: 11.1,
} as const;

export const EMERGENCY_HOTLINES = {
  GBV: '116',
  UTH: '+260 211 251 251',
  POLICE: '999',
  AMBULANCE: '992',
} as const;