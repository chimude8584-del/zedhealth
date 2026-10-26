import React, { useState, createContext, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '../src/shared/AuthContext';
import { useLocalization } from '../src/shared/i18n';

import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import NsansaHomeScreen from '../screens/nsansa/HomeScreen';
import BPLogScreen from '../screens/nsansa/BPLogScreen';
import MedicationsScreen from '../screens/nsansa/MedicationsScreen';
import AppointmentsScreen from '../screens/nsansa/AppointmentsScreen';
import TrendsScreen from '../screens/nsansa/TrendsScreen';
import ReportScreen from '../screens/nsansa/ReportScreen';
import YouthHomeScreen from '../screens/youth/HomeScreen';
import AskScreen from '../screens/youth/AskScreen';
import CycleScreen from '../screens/youth/CycleScreen';
import ClinicsScreen from '../screens/youth/ClinicsScreen';
import SelfTestScreen from '../screens/youth/SelfTestScreen';
import EmergencyScreen from '../screens/youth/EmergencyScreen';
import DataScreen from '../screens/youth/DataScreen';

type AppMode = 'nsansa' | 'youth' | null;
type ScreenRoute =
  | 'onboarding' | 'login'
  | 'nsansa_home' | 'nsansa_bp_log' | 'nsansa_meds' | 'nsansa_appointments' | 'nsansa_trends' | 'nsansa_report'
  | 'youth_home' | 'youth_ask' | 'youth_cycle' | 'youth_clinics' | 'youth_selftest' | 'youth_emergency' | 'youth_data';

interface RouterContextType {
  currentScreen: ScreenRoute;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  navigate: (screen: ScreenRoute) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);
export const useRouter = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be within AppRouter');
  return ctx;
};

export const AppRouter = () => {
  const [appMode, setAppMode] = useState<AppMode>(null);
  const [history, setHistory] = useState<ScreenRoute[]>(['onboarding']);
  const currentScreen = history[history.length - 1];
  const { isPatientLoggedIn } = useAuth();

  const navigate = (screen: ScreenRoute) => setHistory(h => [...h, screen]);
  const goBack = () => setHistory(h => h.length > 1 ? h.slice(0, -1) : h);

  React.useEffect(() => {
    if (isPatientLoggedIn && currentScreen === 'onboarding') {
      setAppMode('nsansa');
      navigate('nsansa_home');
    }
  }, [isPatientLoggedIn, currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding': return <OnboardingScreen />;
      case 'login': return <LoginScreen />;
      case 'nsansa_home': return <NsansaHomeScreen />;
      case 'nsansa_bp_log': return <BPLogScreen />;
      case 'nsansa_meds': return <MedicationsScreen />;
      case 'nsansa_appointments': return <AppointmentsScreen />;
      case 'nsansa_trends': return <TrendsScreen />;
      case 'nsansa_report': return <ReportScreen />;
      case 'youth_home': return <YouthHomeScreen />;
      case 'youth_ask': return <AskScreen />;
      case 'youth_cycle': return <CycleScreen />;
      case 'youth_clinics': return <ClinicsScreen />;
      case 'youth_selftest': return <SelfTestScreen />;
      case 'youth_emergency': return <EmergencyScreen />;
      case 'youth_data': return <DataScreen />;
      default: return <OnboardingScreen />;
    }
  };

  return (
    <RouterContext.Provider value={{ currentScreen, appMode, setAppMode, navigate, goBack }}>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>{renderScreen()}</View>
        {appMode && <BottomTabBar />}
      </SafeAreaView>
    </RouterContext.Provider>
  );
};

const BottomTabBar = () => {
  const { appMode, navigate, currentScreen, setAppMode } = useRouter();
  const { logoutPatient, isPatientLoggedIn } = useAuth();

  const nsansaTabs = [
    { id: 'nsansa_home' as ScreenRoute, label: 'Home', icon: '🏠' },
    { id: 'nsansa_meds' as ScreenRoute, label: 'Meds', icon: '💊' },
    { id: 'nsansa_appointments' as ScreenRoute, label: 'Visits', icon: '📅' },
    { id: 'nsansa_trends' as ScreenRoute, label: 'Trends', icon: '📈' },
  ];

  const youthTabs = [
    { id: 'youth_home' as ScreenRoute, label: 'Home', icon: '🏠' },
    { id: 'youth_cycle' as ScreenRoute, label: 'Cycle', icon: '📆' },
    { id: 'youth_clinics' as ScreenRoute, label: 'Clinics', icon: '🏥' },
    { id: 'youth_ask' as ScreenRoute, label: 'Ask', icon: '❓' },
  ];

  const tabs = appMode === 'nsansa' ? nsansaTabs : youthTabs;

  return (
    <View style={styles.tabBar}>
      {tabs.map(tab => (
        <TouchableOpacity key={tab.id} style={[styles.tab, currentScreen === tab.id && styles.activeTab]} onPress={() => navigate(tab.id)}>
          <Text style={styles.tabIcon}>{tab.icon}</Text>
          <Text style={[styles.tabLabel, currentScreen === tab.id && styles.activeLabel]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.switchTab} onPress={() => {
        if (appMode === 'nsansa' && isPatientLoggedIn) logoutPatient();
        setAppMode(null);
        navigate('onboarding');
      }}>
        <Text style={styles.switchText}>⇄</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#eee', paddingBottom: 8, paddingTop: 8, backgroundColor: '#fff' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  activeTab: { borderTopWidth: 2, borderTopColor: '#2E7D32', marginTop: -2 },
  tabIcon: { fontSize: 18, marginBottom: 2 },
  tabLabel: { fontSize: 11, color: '#777' },
  activeLabel: { color: '#2E7D32', fontWeight: '600' },
  switchTab: { width: 44, alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#eee' },
  switchText: { fontSize: 18, color: '#ED6C30', fontWeight: 'bold' },
});
