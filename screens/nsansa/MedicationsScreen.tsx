import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from '../../navigation/AppRouter';
import { useAuth } from '../../src/shared/AuthContext';
import { useMedications } from '../../hooks/nsansa';
import { Card, Button } from '../../components/UIKit';

export default function MedicationsScreen() {
  const { navigate } = useRouter();
  const { patientUuid } = useAuth();
  const { medications } = useMedications(patientUuid || 'pat-demo-001');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Medications</Text>
      
      {medications.length === 0 ? (
        <Card>
          <Text style={styles.emptyText}>No medications added yet</Text>
          <Button title="+ Add Medication" onPress={() => {}} style={{ marginTop: 12 }} />
        </Card>
      ) : (
        medications.map(med => (
          <Card key={med.uuid}>
            <Text style={styles.medName}>{med.name || 'Medication'}</Text>
            <Text style={styles.medDose}>{med.dosage || ''} — {med.frequency || ''}</Text>
          </Card>
        ))
      )}
      
      <Button title="← Back" variant="secondary" onPress={() => navigate('nsansa_home')} style={{ marginTop: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2E7D32' },
  emptyText: { textAlign: 'center', color: '#777', fontSize: 16 },
  medName: { fontSize: 18, fontWeight: '600' },
  medDose: { fontSize: 14, color: '#666', marginTop: 4 },
});
