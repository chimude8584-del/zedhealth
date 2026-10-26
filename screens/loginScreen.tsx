import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from '../navigation/AppRouter';
import { useAuth } from '../src/shared/AuthContext';
import { Input, Button, Banner } from '../components/UIKit';

export default function LoginScreen() {
  const { navigate } = useRouter();
  const { loginPatient } = useAuth();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSendCode = async () => {
    setError('');
    if (!phone.replace(/\D/g, '').length >= 9) {
      setError('Please enter a valid phone number');
      return;
    }
    setStep('code');
    setSuccessMsg('Code sent! (Demo mode — enter any 6 digits)');
  };

  const handleVerify = async () => {
    setError('');
    setLoading(true);
    const result = await loginPatient(phone, code);
    setLoading(false);

    if (result.success) {
      navigate('nsansa_home');
    } else {
      setError(result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Nsansa</Text>
        <Text style={styles.subtitle}>Sign in to view your health records</Text>

        {error ? <Banner text={error} type="danger" /> : null}
        {successMsg ? <Banner text={successMsg} type="success" /> : null}

        {step === 'phone' ? (
          <View style={styles.form}>
            <Input
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="e.g. 096 123 4567"
              keyboardType="phone-pad"
            />
            <Button title="Send Code" onPress={handleSendCode} />
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              label="Verification Code"
              value={code}
              onChangeText={setCode}
              placeholder="Enter 6-digit code"
              keyboardType="number-pad"
            />
            <Button
              title={loading ? 'Verifying...' : 'Sign In'}
              onPress={handleVerify}
              loading={loading}
            />
            <Text style={styles.hint}>
              Demo: enter any code to continue offline
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
  },
  form: {
    marginTop: 8,
  },
  hint: {
    marginTop: 12,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});