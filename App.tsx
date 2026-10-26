import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initDatabase } from './src/shared/db';
import { seedFacilities } from './src/shared/facilities';
import { startSyncLoop } from './src/shared/sync';
import { AuthProvider } from './src/shared/AuthContext';
import { AppRouter } from './navigation/AppRouter';
import { useNetworkState } from './hooks/core';

const AppContent = () => {
  const [isReady, setIsReady] = useState(false);
  const { isOnline } = useNetworkState();

  useEffect(() => {
    const bootstrap = async () => {
      await initDatabase();
      await seedFacilities();
      startSyncLoop();
      setIsReady(true);
    };
    bootstrap();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Starting ZedHealth...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>You are offline — changes will sync when reconnected</Text>
        </View>
      )}
      <AppRouter />
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  offlineBanner: {
    backgroundColor: '#FFF3E0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  offlineText: {
    fontSize: 12,
    color: '#E65100',
  },
});