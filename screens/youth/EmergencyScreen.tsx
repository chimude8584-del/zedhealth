import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { useRouter } from '../../navigation/AppRouter';
import { Card, Button } from '../../components/UIKit';

const hotlines = [
  { name: 'Zambia National Helpline', number: '999', desc: 'Emergency — free call' },
  { name: 'Childline Zambia', number: '116', desc: 'Support for children — free' },
  { name: 'ZANEC Sexual Health', number: '0211 223 444', desc: 'Confidential advice' },
  { name: 'Lusaka Women’s Hospital', number: '0211 250 111', desc: 'Emergency care' }
];

export default function EmergencyScreen() {
  const { navigate } = useRouter();

  const call = (num: string) => {
    Linking.openURL(`tel:${num.replace(/\s/g, '')}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help & Emergency</Text>
      <Text style={styles.emergencyNote}>🚨 If you are in immediate danger — CALL 999 NOW</Text>
      
      {hotlines.map((h, i) => (
        <TouchableOpacity key={i} onPress={() => call(h.number)}>
          <Card style={styles.hotlineCard}>
            <Text style={styles.hotlineName}>{h.name}</Text>
            <Text style={styles.hotlineNumber}>{h.number}</Text>
            <Text style={styles.hotlineDesc}>{h.desc}</Text>
          </Card>
        </TouchableOpacity>
      ))}
      
      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>When to seek help urgently:</Text>
        <Text style={styles.infoItem}>• Severe pain that won't stop</Text>
        <Text style={styles.infoItem}>• Heavy bleeding</Text>
        <Text style={styles.infoItem}>• Fever that won't go away</Text>
        <Text style={styles.infoItem}>• Feeling unsafe or at risk</Text>
      </Card>
      
      <Button title="← Back" variant="secondary" onPress={() => navigate('youth_home')} style={{ marginTop: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#D32F2F' },
  emergencyNote: { fontSize: 15, color: '#D32F2F', fontWeight: '600', marginBottom: 20 },
  hotlineCard: { marginBottom: 8 },
  hotlineName: { fontSize: 15, fontWeight: '600' },
  hotlineNumber: { fontSize: 20, fontWeight: 'bold', color: '#1976D2', marginVertical: 4 },
  hotlineDesc: { fontSize: 12, color: '#666' },
  infoCard: { backgroundColor: '#FFF3E0' },
  infoTitle: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
  infoItem: { fontSize: 14, color: '#444', marginBottom: 6 },
});
