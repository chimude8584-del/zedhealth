import React, { useState, createContext, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '../src/shared/AuthContext';
import { useLocalization } from '../src/shared/i18n';

// Screen imports — we'll create these next
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import NsansaHomeScreen from '../screens/nsansa/HomeScreen';
import YouthHomeScreen from '../screens/youth/HomeScreen';

type AppMode = 'nsansa' | 'youth' | null;
type ScreenRoute =
  | 'onboarding'
  | 'login'
  | 'nsansa_home'
  | 'nsansa_bp_log'
  | 'nsansa_meds'
  | 'nsansa_appointments'
  | 'nsansa_trends'
  | 'nsansa_report'
  | 'youth_home'
  | 'youth_ask'
  | 'youth_cycle'
  | 'youth_clinics'
  | 'youth_selftest'
  | 'youth_emergency'
  | 'youth_data';

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
  const { t } = useLocalization();

  const navigate = (screen: ScreenRoute) => setHistory(h => [...h, screen]);
  const goBack = () => setHistory(h => h.length > 1 ? h.slice(0, -1) : h);

  // Auto-redirect logged-in users
  React.useEffect(() => {
    if (isPatientLoggedIn && currentScreen === 'onboarding') {
      setAppMode('nsansa');
      navigate('nsansa_home');
    }
  }, [isPatientLoggedIn, currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen />;
      case 'login':
        return <LoginScreen />;
      case 'nsansa_home':
        return <NsansaHomeScreen />;
      case 'youth_home':
        return <YouthHomeScreen />;
      default:
        return (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              {currentScreen.replace(/_/g, ' ').toUpperCase()}
            </Text>
            <TouchableOpacity onPress={goBack} style={styles.backBtn}>
              <Text style={styles.backText}>← Go Back</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <RouterContext.Provider value={{ currentScreen, appMode, setAppMode, navigate, goBack }}>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>{renderScreen()}</View>
        {/* Bottom Tab Bar — only shown once mode is selected */}
        {appMode && <BottomTabBar />}
      </SafeAreaView>
    </RouterContext.Provider>
  );
};

const BottomTabBar = () => {
  const { appMode, navigate, currentScreen, setAppMode } = useRouter();
  const { logoutPatient, isPatientLoggedIn } = useAuth();
  const { t } = useLocalization();

  const tabs = appMode === 'nsansa'
    ? [
        { id: 'nsansa_home' as ScreenRoute, label: 'Home', icon: '🏠' },
        { id: 'nsansa_meds' as ScreenRoute, label: 'Meds', icon: '💊' },
        { id: 'nsansa_appointments' as ScreenRoute, label: 'Visits', icon: '📅' },
        { id: 'nsansa_trends' as ScreenRoute, label: 'Trends', icon: '📈' },
      ]
    : [
        { id: 'youth_home' as ScreenRoute, label: 'Home', icon: '🏠' },
        { id: 'youth_cycle' as ScreenRoute, label: 'Cycle', icon: '📆' },
        { id: 'youth_clinics' as ScreenRoute, label: 'Clinics', icon: '🏥' },
        { id: 'youth_ask' as ScreenRoute, label: 'Ask', icon: '❓' },
      ];

  return (
    <View style={styles.tabBar}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, currentScreen === tab.id && styles.activeTab]}
          onPress={() => navigate(tab.id)}
        >
          <Text style={styles.tabIcon}>{tab.icon}</Text>
          <Text style={[styles.tabLabel, currentScreen === tab.id && styles.activeLabel]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
      {/* Switch button */}
      <TouchableOpacity
        style={styles.switchTab}
        onPress={() => {
          if (appMode === 'nsansa' && isPatientLoggedIn) logoutPatient();
          setAppMode(null);
          navigate('onboarding');
        }}
      >
        <Text style={styles.switchText}>⇄</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  placeholderText: { fontSize: 18, color: '#999', marginBottom: 20 },
  backBtn: { padding: 12, backgroundColor: '#eee', borderRadius: 8 },
  backText: { fontSize: 14, color: '#333' },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  activeTab: { borderTopWidth: 2, borderTopColor: '#2E7D32', marginTop: -2 },
  tabIcon: { fontSize: 18, marginBottom: 2 },
  tabLabel: { fontSize: 11, color: '#777' },
  activeLabel: { color: '#2E7D32', fontWeight: '600' },
  switchTab: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  switchText: { fontSize: 18, color: '#ED6C30', fontWeight: 'bold' },
});