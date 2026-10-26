import React from 'react';
import { View, Text, StyleSheet, ScrollView, Share } from 'react-native';
import { useRouter } from '../../navigation/AppRouter';
import { useAuth } from '../../src/shared/AuthContext';
import { useBPLogger } from '../../hooks/nsansa';
import { Card, Button } from '../../components/UIKit';

export default function ReportScreen() {
  const { navigate } = useRouter();
  const { patientName, patientUuid } = useAuth();
  const { latest, series } = useBPLogger(patientUuid || 'pat-demo-001');

  const shareReport = async () => {
    const report = `
ZEDHEALTH — PATIENT REPORT
==========================
Patient: ${patientName || 'Anonymous'}
Generated: ${new Date().toLocaleString()}

LATEST READING
Systolic: ${latest?.sys || 'N/A'} mmHg
Diastolic: ${latest?.dia || 'N/A'} mmHg
Pulse: ${latest?.pulse || 'N/A'} bpm

HISTORY (Last 10 readings)
${series.slice(-10).map(s => `${new Date(s.date).toLocaleDateString()} — ${s.sys}/${s.dia}`).join('\n') || 'No history yet'}
    `.trim();
    await Share.share({ message: report });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Clinic Report</Text>
      
      <Card>
        <Text style={styles.sectionTitle}>Patient Summary</Text>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{patientName || 'Not provided'}</Text>
        <Text style={styles.label}>Latest BP:</Text>
        <Text style={styles.value}>{latest ? `${latest.sys} / ${latest.dia} mmHg` : 'No data'}</Text>
        <Text style={styles.label}>Total Readings:</Text>
        <Text style={styles.value}>{series.length}</Text>
      </Card>
      
      <Button title="📄 Share Report" onPress={shareReport} style={{ marginTop: 16 }} />
      <Button title="← Back" variant="secondary" onPress={() => navigate('nsansa_home')} style={{ marginTop: 8 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2E7D32' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  label: { fontSize: 14, color: '#666', marginTop: 8 },
  value: { fontSize: 16, fontWeight: '500' },
});
