import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from '../../navigation/AppRouter';
import { Card, Button } from '../../components/UIKit';

export default function AppointmentsScreen() {
  const { navigate } = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Appointments</Text>
      
      <Card>
        <Text style={styles.sectionTitle}>Upcoming Visits</Text>
        <Text style={styles.emptyText}>No appointments scheduled</Text>
        <Button title="+ Schedule Visit" onPress={() => {}} style={{ marginTop: 12 }} />
      </Card>
      
      <Card>
        <Text style={styles.sectionTitle}>Past Visits</Text>
        <Text style={styles.emptyText}>No history yet</Text>
      </Card>
      
      <Button title="← Back" variant="secondary" onPress={() => navigate('nsansa_home')} style={{ marginTop: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2E7D32' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  emptyText: { textAlign: 'center', color: '#777', fontSize: 14, paddingVertical: 16 },
});
