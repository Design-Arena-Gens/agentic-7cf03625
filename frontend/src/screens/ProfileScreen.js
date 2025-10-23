import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext.js';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{user?.phone || 'Not provided'}</Text>
        <Text style={styles.label}>Affiliate ID</Text>
        <Text style={styles.value}>{user?.affiliateId}</Text>
        <Text style={styles.label}>Referral Link</Text>
        <Text style={styles.value}>{`https://netweave.pro/join/${user?.affiliateId}`}</Text>
      </View>

      <View style={styles.earnings}>
        <Text style={styles.label}>Earnings Balance</Text>
        <Text style={styles.balance}>${Number(user?.earnings?.balance || 0).toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 20,
    gap: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#6b7280',
  },
  value: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 8,
  },
  earnings: {
    backgroundColor: '#2563eb',
    padding: 20,
    borderRadius: 16,
  },
  balance: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  button: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700' },
});
