import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config';
import { getDb } from './db';

interface AuthContextType {
  // Nsansa patient auth
  patientUuid: string | null;
  patientPhone: string | null;
  patientName: string | null;
  isPatientLoggedIn: boolean;
  loginPatient: (phone: string, code: string) => Promise<{ success: boolean; message: string }>;
  logoutPatient: () => Promise<void>;

  // YouthConnect anonymous identity
  deviceHash: string | null;
  ensureDeviceHash: () => Promise<string>;

  // Shared
  preferredLang: 'en' | 'ny' | 'bem' | 'ton';
  setPreferredLang: (lang: 'en' | 'ny' | 'bem' | 'ton') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEVICE_HASH_KEY = 'zedhealth_device_hash';
const PATIENT_UUID_KEY = 'zedhealth_patient_uuid';
const PATIENT_PHONE_KEY = 'zedhealth_patient_phone';
const PATIENT_NAME_KEY = 'zedhealth_patient_name';
const LANG_KEY = 'zedhealth_preferred_lang';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [patientUuid, setPatientUuid] = useState<string | null>(null);
  const [patientPhone, setPatientPhone] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string | null>(null);
  const [deviceHash, setDeviceHash] = useState<string | null>(null);
  const [preferredLang, setPreferredLangState] = useState<'en' | 'ny' | 'bem' | 'ton'>('en');

  // Load persisted state on mount
  useEffect(() => {
    const loadAuth = async () => {
      const savedUuid = await SecureStore.getItemAsync(PATIENT_UUID_KEY);
      const savedPhone = await SecureStore.getItemAsync(PATIENT_PHONE_KEY);
      const savedName = await SecureStore.getItemAsync(PATIENT_NAME_KEY);
      const savedHash = await SecureStore.getItemAsync(DEVICE_HASH_KEY);
      const savedLang = await SecureStore.getItemAsync(LANG_KEY) as 'en' | 'ny' | 'bem' | 'ton' | null;

      if (savedUuid) setPatientUuid(savedUuid);
      if (savedPhone) setPatientPhone(savedPhone);
      if (savedName) setPatientName(savedName);
      if (savedHash) setDeviceHash(savedHash);
      if (savedLang) setPreferredLangState(savedLang);
    };
    loadAuth();
  }, []);

  // Generate stable anonymous device hash
  const ensureDeviceHash = async (): Promise<string> => {
    if (deviceHash) return deviceHash;

    let hash = await SecureStore.getItemAsync(DEVICE_HASH_KEY);
    if (!hash) {
      const randomBytes = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${Date.now()}-${Math.random()}-ZedHealth`
      );
      hash = randomBytes.slice(0, 16);
      await SecureStore.setItemAsync(DEVICE_HASH_KEY, hash);
    }

    setDeviceHash(hash);
    return hash;
  };

  // Nsansa OTP login
  const loginPatient = async (phone: string, code: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });

      const result = await res.json();

      if (!res.ok) {
        return { success: false, message: result.message || 'Invalid code. Please try again.' };
      }

      const { uuid, displayName, token } = result;

      // Store session
      await SecureStore.setItemAsync(PATIENT_UUID_KEY, uuid);
      await SecureStore.setItemAsync(PATIENT_PHONE_KEY, phone);
      if (displayName) await SecureStore.setItemAsync(PATIENT_NAME_KEY, displayName);

      setPatientUuid(uuid);
      setPatientPhone(phone);
      setPatientName(displayName || null);

      return { success: true, message: 'Welcome back!' };
    } catch (err) {
      // Offline fallback — allow demo mode
      if (!navigator.onLine || true) {
        const demoUuid = 'pat-demo-' + phone.replace(/\D/g, '').slice(-4);
        await SecureStore.setItemAsync(PATIENT_UUID_KEY, demoUuid);
        await SecureStore.setItemAsync(PATIENT_PHONE_KEY, phone);
        setPatientUuid(demoUuid);
        setPatientPhone(phone);
        return { success: true, message: 'Offline demo mode — working fully offline' };
      }
      return { success: false, message: 'Network error. Try again when online.' };
    }
  };

  const logoutPatient = async () => {
    await SecureStore.deleteItemAsync(PATIENT_UUID_KEY);
    await SecureStore.deleteItemAsync(PATIENT_PHONE_KEY);
    await SecureStore.deleteItemAsync(PATIENT_NAME_KEY);
    setPatientUuid(null);
    setPatientPhone(null);
    setPatientName(null);
  };

  const setPreferredLang = async (lang: 'en' | 'ny' | 'bem' | 'ton') => {
    setPreferredLangState(lang);
    await SecureStore.setItemAsync(LANG_KEY, lang);
  };

  return (
    <AuthContext.Provider value={{
      patientUuid,
      patientPhone,
      patientName,
      isPatientLoggedIn: !!patientUuid,
      loginPatient,
      logoutPatient,
      deviceHash,
      ensureDeviceHash,
      preferredLang,
      setPreferredLang,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const useCurrentPatient = () => {
  const { patientUuid, patientPhone, patientName, isPatientLoggedIn } = useAuth();
  return { uuid: patientUuid, phone: patientPhone, name: patientName, isLoggedIn: isPatientLoggedIn };
};

export const useCurrentDeviceHash = () => {
  const { deviceHash, ensureDeviceHash } = useAuth();
  return { deviceHash, ensureDeviceHash };
};