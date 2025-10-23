import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext.js';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    sponsorAffiliateId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await register(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Grow your network with NetWeave Pro</Text>

      {['firstName', 'lastName', 'email', 'phone', 'password', 'sponsorAffiliateId'].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field === 'sponsorAffiliateId' ? 'Sponsor Affiliate ID (optional)' : field.charAt(0).toUpperCase() + field.slice(1)}
          secureTextEntry={field === 'password'}
          autoCapitalize={field === 'email' ? 'none' : 'words'}
          keyboardType={field === 'email' ? 'email-address' : 'default'}
          value={form[field]}
          onChangeText={(text) => setForm((prev) => ({ ...prev, [field]: text }))}
        />
      ))}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f5f7ff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  link: {
    color: '#2563eb',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 24,
  },
  error: {
    color: '#ef4444',
    marginBottom: 12,
  },
});
