import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from '../../navigation/AppRouter';
import { useBPLogger } from '../../hooks/nsansa';
import { useAuth } from '../../src/shared/AuthContext';
import { Input, Button, Banner } from '../../components/UIKit';

export default function BPLogScreen() {
  const { navigate } = useRouter();
  const { patientUuid } = useAuth();
  const { log, dangerActive } = useBPLogger(patientUuid || 'pat-demo-001');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const sysNum = parseInt(systolic);
    const diaNum = parseInt(diastolic);
    const pulseNum = pulse ? parseInt(pulse) : undefined;
    if (!sysNum || !diaNum || sysNum < 70 || sysNum > 250 || diaNum < 40 || diaNum > 180) return;
    await log(sysNum, diaNum, pulseNum);
    setSaved(true);
    setTimeout(() => navigate('nsansa_home'), 1200);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.title}>Log Blood Pressure</Text>
        {dangerActive && <Banner text="⚠️ Very high — see a doctor" type="danger" />}
        {saved && <Banner text="✅ Saved!" type="success" />}
        <Input label="Systolic" value={systolic} onChangeText={setSystolic} placeholder="e.g. 120" keyboardType="numeric" />
        <Input label="Diastolic" value={diastolic} onChangeText={setDiastolic} placeholder="e.g. 80" keyboardType="numeric" />
        <Input label="Pulse (Optional)" value={pulse} onChangeText={setPulse} placeholder="e.g. 72" keyboardType="numeric" />
        <Button title="Save" onPress={handleSave} style={{ marginTop: 16 }} />
        <Button title="← Cancel" variant="secondary" onPress={() => navigate('nsansa_home')} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#2E7D32' },
});
