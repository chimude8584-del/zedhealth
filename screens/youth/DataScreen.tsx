import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from '../../navigation/AppRouter';
import { useAuth } from '../../src/shared/AuthContext';
import { Card, Button } from '../../components/UIKit';

export default function DataScreen() {
  const { navigate, setAppMode } = useRouter();
  const { logoutPatient } = useAuth();

  const confirmWipe = () => {
    Alert.alert(
      '⚠️ Delete All My Data',
      'This will erase EVERYTHING — questions, cycle history, codes. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete All', style: 'destructive', onPress: () => {
          logoutPatient();
          setAppMode(null);
          navigate('onboarding');
        }}
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Data & Privacy</Text>
      
      <Card>
        <Text style={styles.sectionTitle}>Your Privacy</Text>
        <Text style={styles.privacyItem}>✅ Your identity is protected</Text>
        <Text style={styles.privacyItem}>✅ No names linked to your questions</Text>
        <Text style={styles.privacyItem}>✅ Your data stays on your phone</Text>
        <Text style={styles.privacyItem}>✅ Nothing shared without your permission</Text>
      </Card>
      
      <Card>
        <Text style={styles.sectionTitle}>Manage Your Data</Text>
        <Text style={styles.desc}>You can remove all your information from this device at any time.</Text>
        <Button title="🗑️ Wipe All My Data" variant="secondary" onPress={confirmWipe} style={{ marginTop: 12, borderColor: '#D32F2F' }} />
      </Card>
      
      <Button title="← Back" variant="secondary" onPress={() => navigate('youth_home')} style={{ marginTop: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#ED6C30' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  desc: { fontSize: 14, color: '#666', lineHeight: 20 },
  privacyItem: { fontSize: 14, color: '#444', marginBottom: 10 },
});
