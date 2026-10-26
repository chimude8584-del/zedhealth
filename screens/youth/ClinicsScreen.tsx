import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { useRouter } from '../../navigation/AppRouter';
import { Card, Button } from '../../components/UIKit';

const clinics = [
  {
    name: 'University Teaching Hospital',
    address: 'Lusaka',
    phone: '0211 251 201',
    youthFriendly: true,
    services: ['General', 'SRH', 'Counselling']
  },
  {
    name: 'Kanyama Clinic',
    address: 'Kanyama, Lusaka',
    phone: '0211 264 510',
    youthFriendly: true,
    services: ['General', 'Family Planning']
  },
  {
    name: 'Chipata Level 1 Hospital',
    address: 'Chipata',
    phone: '0216 221 345',
    youthFriendly: false,
    services: ['General', 'Lab']
  },
  {
    name: 'Ndola Central Hospital',
    address: 'Ndola',
    phone: '0212 612 345',
    youthFriendly: true,
    services: ['General', 'SRH', 'Emergency']
  }
];

export default function ClinicsScreen() {
  const { navigate } = useRouter();

  const call = (num: string) => {
    Linking.openURL(`tel:${num.replace(/\s/g, '')}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Find Clinics</Text>
      <Text style={styles.subtitle}>Youth-friendly services across Zambia 🇿🇲</Text>
      
      {clinics.map((c, i) => (
        <Card key={i}>
          <View style={styles.cardHeader}>
            <Text style={styles.name}>{c.name}</Text>
            {c.youthFriendly && <Text style={styles.badge}>Youth ✅</Text>}
          </View>
          <Text style={styles.address}>📍 {c.address}</Text>
          <TouchableOpacity onPress={() => call(c.phone)}>
            <Text style={styles.phone}>📞 {c.phone}</Text>
          </TouchableOpacity>
          <View style={styles.services}>
            {c.services.map((s, j) => (
              <Text key={j} style={styles.serviceTag}>{s}</Text>
            ))}
          </View>
        </Card>
      ))}
      
      <Button title="← Back" variant="secondary" onPress={() => navigate('youth_home')} style={{ marginTop: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4, color: '#ED6C30' },
  subtitle: { fontSize: 13, color: '#777', marginBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  name: { fontSize: 16, fontWeight: '600' },
  badge: { fontSize: 11, backgroundColor: '#4CAF50', color: '#fff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  address: { fontSize: 14, color: '#555', marginBottom: 4 },
  phone: { fontSize: 14, color: '#2196F3', marginBottom: 8 },
  services: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  serviceTag: { fontSize: 11, backgroundColor: '#E0E0E0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
});
