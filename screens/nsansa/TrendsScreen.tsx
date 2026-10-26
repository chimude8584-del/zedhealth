import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from '../../navigation/AppRouter';
import { useAuth } from '../../src/shared/AuthContext';
import { useBPLogger, useVitalsSeries } from '../../hooks/nsansa';
import { Card, Button } from '../../components/UIKit';
import { LineChart } from '../../components/Charts';

export default function TrendsScreen() {
  const { navigate } = useRouter();
  const { patientUuid } = useAuth();
  const puuid = patientUuid || 'pat-demo-001';
  const { series } = useBPLogger(puuid);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Health Trends</Text>
      
      <Card>
        <Text style={styles.sectionTitle}>Blood Pressure — Systolic</Text>
        {series.length > 1 ? (
          <LineChart data={series.map(s => ({ date: s.date, value: s.sys }))} color="#2E7D32" />
        ) : <Text style={styles.emptyText}>Log more readings to see trends</Text>}
      </Card>
      
      <Card>
        <Text style={styles.sectionTitle}>Blood Pressure — Diastolic</Text>
        {series.length > 1 ? (
          <LineChart data={series.map(s => ({ date: s.date, value: s.dia }))} color="#ED6C30" />
        ) : <Text style={styles.emptyText}>Log more readings to see trends</Text>}
      </Card>
      
      <Button title="← Back" variant="secondary" onPress={() => navigate('nsansa_home')} style={{ marginTop: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2E7D32' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  emptyText: { textAlign: 'center', color: '#777', paddingVertical: 20 },
});
