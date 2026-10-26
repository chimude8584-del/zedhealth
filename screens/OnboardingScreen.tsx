import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from '../navigation/AppRouter';
import { useAuth } from '../src/shared/AuthContext';

export default function OnboardingScreen() {
  const { setAppMode, navigate } = useRouter();
  const { ensureDeviceHash } = useAuth();

  const selectNsansa = () => {
    setAppMode('nsansa');
    navigate('login');
  };

  const selectYouth = async () => {
    await ensureDeviceHash();
    setAppMode('youth');
    navigate('youth_home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ZedHealth</Text>
        <Text style={styles.subtitle}>Your health, in your hands — works everywhere, even offline</Text>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity style={[styles.card, styles.nsansaCard]} onPress={selectNsansa}>
          <Text style={styles.cardIcon}>💚</Text>
          <Text style={styles.cardTitle}>Nsansa Health</Text>
          <Text style={styles.cardDesc}>
            Track blood pressure, glucose, medications & appointments. Share reports with your clinic.
          </Text>
          <View style={styles.cardBadge}>
            <Text style={styles.badgeText}>For patients & families</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.youthCard]} onPress={selectYouth}>
          <Text style={styles.cardIcon}>🧡</Text>
          <Text style={styles.cardTitle}>YouthConnect SRH</Text>
          <Text style={styles.cardDesc}>
            Ask questions anonymously, track your cycle, find youth-friendly clinics — completely private.
          </Text>
          <View style={styles.cardBadgeYouth}>
            <Text style={styles.badgeTextYouth}>100% Anonymous</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Built for Zambia 🇿🇲 • Fully offline-first</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    minHeight: 180,
    justifyContent: 'center',
  },
  nsansaCard: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  youthCard: {
    backgroundColor: '#FFF3E0',
    borderWidth: 2,
    borderColor: '#ED6C30',
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBadgeYouth: {
    alignSelf: 'flex-start',
    backgroundColor: '#ED6C30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextYouth: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});