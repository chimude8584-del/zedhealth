import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from '../../navigation/AppRouter';
import { Card, Button } from '../../components/UIKit';

export default function CycleScreen() {
  const { navigate } = useRouter();
  const [periods, setPeriods] = useState([
    { start: '2026-10-05', end: '2026-10-10' },
  ]);

  const nextPeriod = { start: '2026-11-02', daysFromNow: 7 };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cycle Tracker</Text>
      
      <Card style={styles.forecastCard}>
        <Text style={styles.forecastLabel}>Next Period Expected</Text>
        <Text style={styles.forecastDate}>{nextPeriod.start}</Text>
        <Text style={styles.forecastDays}>In {nextPeriod.daysFromNow} days</Text>
      </Card>
      
      <Card>
        <Text style={styles.sectionTitle}>Log Period</Text>
        <TouchableOpacity style={styles.logBtn}>
          <Text style={styles.logText}>🩸 First Day → Tap to Log</Text>
        </TouchableOpacity>
      </Card>
      
      <Card>
        <Text style={styles.sectionTitle}>History</Text>
        {periods.map((p, i) => (
          <View key={i} style={styles.historyItem}>
            <Text style={styles.historyDate}>{p.start} — {p.end}</Text>
            <Text style={styles.historyLen}>{7} days</Text>
          </View>
        ))}
      </Card>
      
      <Card>
        <Text style={styles.sectionTitle}>Health Tips</Text>
        <Text style={styles.tip}>• Stay hydrated 💧</Text>
        <Text style={styles.tip}>• Get enough rest 😴</Text>
        <Text style={styles.tip}>• Pain relief is normal — ask a pharmacist 💊</Text>
        <Text style={styles.tip}>• See a doctor if pain is severe 🏥</Text>
      </Card>
      
      <Button title="← Back" variant="secondary" onPress={() => navigate('youth_home')} style={{ marginTop: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#ED6C30' },
  forecastCard: { backgroundColor: '#FBE9E7', borderWidth: 2, borderColor: '#FFAB91', alignItems: 'center' },
  forecastLabel: { fontSize: 14, color: '#E64A19' },
  forecastDate: { fontSize: 26, fontWeight: 'bold', color: '#D84315', marginVertical: 4 },
  forecastDays: { fontSize: 14, color: '#666' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  logBtn: { backgroundColor: '#FFCCBC', borderRadius: 10, padding: 16, alignItems: 'center' },
  logText: { fontSize: 15, fontWeight: '600', color: '#D84315' },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  historyDate: { fontSize: 14 },
  historyLen: { fontSize: 13, color: '#888' },
  tip: { fontSize: 14, color: '#555', marginBottom: 6 },
});
