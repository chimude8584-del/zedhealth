import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from '../../navigation/AppRouter';
import { useSelfTest } from '../../hooks/youth';
import { Card, Button, Banner } from '../../components/UIKit';

export default function SelfTestScreen() {
  const { navigate } = useRouter();
  const { generateCode, kitCodes } = useSelfTest();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Self-Test Kits</Text>
      <Text style={styles.subtitle}>Get your unique code to collect a kit 🏥</Text>
      
      <Card>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.step}>1. Tap below to generate your code</Text>
        <Text style={styles.step}>2. Take it to a participating clinic</Text>
        <Text style={styles.step}>3. Collect your kit — completely free</Text>
        <Text style={styles.step}>4. Follow instructions inside the kit</Text>
        <Button title="+ Generate New Code" onPress={generateCode} style={{ marginTop: 16 }} />
      </Card>
      
      <Text style={styles.sectionTitle}>Your Codes</Text>
      {kitCodes.length === 0 ? (
        <Banner text="No codes yet — generate one above" type="default" />
      ) : (
        kitCodes.map((k, i) => (
          <Card key={i}>
            <Text style={styles.code}>{k.code}</Text>
            <Text style={styles.codeStatus}>{k.used ? '✅ Collected' : '⏳ Valid'}</Text>
            <Text style={styles.codeDate}>Issued: {k.issued}</Text>
          </Card>
        ))
      )}
      
      <Button title="← Back" variant="secondary" onPress={() => navigate('youth_home')} style={{ marginTop: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4, color: '#ED6C30' },
  subtitle: { fontSize: 13, color: '#777', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  step: { fontSize: 14, color: '#555', marginBottom: 8 },
  code: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', letterSpacing: 4, color: '#2E7D32' },
  codeStatus: { textAlign: 'center', fontSize: 14, marginTop: 4 },
  codeDate: { textAlign: 'center', fontSize: 12, color: '#888', marginTop: 4 },
});
