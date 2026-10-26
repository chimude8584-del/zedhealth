import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from '../../navigation/AppRouter';
import { useAuth } from '../../src/shared/AuthContext';
import { useAnonymousQA } from '../../hooks/youth';
import { Input, Button, Card, Banner } from '../../components/UIKit';

export default function AskScreen() {
  const { navigate } = useRouter();
  const { deviceHash } = useAuth();
  const { myQuestions, submit } = useAnonymousQA(deviceHash || 'demo-hash');
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (question.length < 10) return;
    await submit(question, 'general');
    setSubmitted(true);
    setQuestion('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ask a Question</Text>
      <Text style={styles.subtitle}>Your identity stays private — no names, no tracking ✅</Text>
      
      {submitted && <Banner text="✅ Question submitted! Answer will appear here" type="success" />}
      
      <Card>
        <Input
          label="Your Question"
          value={question}
          onChangeText={setQuestion}
          placeholder="Type anything — health, relationships, life..."
          multiline
          style={{ minHeight: 100 }}
        />
        <Button title="Submit Anonymously" onPress={handleSubmit} style={{ marginTop: 12 }} />
      </Card>
      
      <Text style={styles.sectionTitle}>Your Questions</Text>
      {myQuestions.length === 0 ? (
        <Text style={styles.emptyText}>No questions yet — be the first to ask!</Text>
      ) : (
        myQuestions.map((q, i) => (
          <Card key={i}>
            <Text style={styles.qText}>Q: {q.question}</Text>
            <Text style={styles.aText}>A: Pending answer...</Text>
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
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 12 },
  emptyText: { textAlign: 'center', color: '#999', paddingVertical: 20 },
  qText: { fontSize: 15, fontWeight: '500', marginBottom: 8 },
  aText: { fontSize: 14, color: '#555', fontStyle: 'italic' },
});
