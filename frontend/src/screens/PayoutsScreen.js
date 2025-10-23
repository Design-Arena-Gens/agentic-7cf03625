import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import api from '../services/api.js';

export default function PayoutsScreen() {
  const [payouts, setPayouts] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const loadPayouts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/payouts');
      setPayouts(data.payouts);
    } catch (err) {
      // TODO: report error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayouts();
  }, []);

  const requestPayout = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount) {
      Alert.alert('Invalid amount', 'Enter a payout amount');
      return;
    }
    try {
      setLoading(true);
      await api.post('/payouts', { amount: numericAmount });
      setAmount('');
      loadPayouts();
      Alert.alert('Request submitted', 'Your payout request is pending review');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Unable to request payout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TouchableOpacity style={styles.button} onPress={requestPayout}>
          <Text style={styles.buttonText}>Request Payout</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.list}
        contentContainerStyle={{ gap: 12, paddingBottom: 32 }}
        data={payouts}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadPayouts} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
            <Text style={[styles.status, styles[`status_${item.status}`]]}>{item.status}</Text>
            <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 16 },
  form: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  list: { flex: 1 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  amount: { fontSize: 20, fontWeight: '700', color: '#111827' },
  status: { textTransform: 'capitalize', fontWeight: '600' },
  status_pending: { color: '#f59e0b' },
  status_processing: { color: '#2563eb' },
  status_paid: { color: '#16a34a' },
  status_failed: { color: '#ef4444' },
  timestamp: { color: '#9ca3af', marginTop: 8, fontSize: 12 },
});
