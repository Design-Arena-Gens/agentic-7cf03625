import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatCard({ label, value, accent = '#2563eb' }) {
  return (
    <View style={[styles.container, { borderColor: accent }] }>
      <Text style={[styles.label, { color: accent }]}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
});
