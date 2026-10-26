import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from '../../navigation/AppRouter';
import { Card } from '../../components/UIKit';

export default function YouthHomeScreen() {
  const { navigate } = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>YouthConnect</Text>
        <Text style={styles.subtitle}>Safe, private, anonymous — always 💛</Text>
      </View>
      
      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigate('youth_ask')}>
          <Text style={styles.icon}>❓</Text>
          <Text style={styles.label}>Ask a Question</Text>
          <Text style={styles.desc}>Get answers privately</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.gridItem} onPress={() => navigate('youth_cycle')}>
          <Text style={styles.icon}>📆</Text>
          <Text style={styles.label}>Cycle Tracker</Text>
          <Text style={styles.desc}>Monitor your health</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.gridItem} onPress={() => navigate('youth_clinics')}>
          <Text style={styles.icon}>🏥</Text>
          <Text style={styles.label}>Find Clinics</Text>
          <Text style={styles.desc}>Youth-friendly services</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.gridItem} onPress={() => navigate('youth_selftest')}>
          <Text style={styles.icon}>🧪</Text>
          <Text style={styles.label}>Self-Test</Text>
          <Text style={styles.desc}>Pickup & codes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.gridItem} onPress={() => navigate('youth_emergency')}>
          <Text style={styles.icon}>🆘</Text>
          <Text style={styles.label}>Emergency</Text>
          <Text style={styles.desc}>Help & hotlines</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.gridItem} onPress={() => navigate('youth_data')}>
          <Text style={styles.icon}>🔒</Text>
          <Text style={styles.label}>My Data</Text>
          <Text style={styles.desc}>Privacy & controls</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { alignItems: 'center', marginVertical: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ED6C30' },
  subtitle: { fontSize: 14, color: '#777', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', backgroundColor: '#FFF3E0', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16 },
  icon: { fontSize: 28, marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#E65100' },
  desc: { fontSize: 11, color: '#888', marginTop: 2, textAlign: 'center' },
});
