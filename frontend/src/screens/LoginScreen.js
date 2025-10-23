import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext.js';

export default function LoginScreen({ navigation }) {
  const { login, socialLogin } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await login(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider) => {
    try {
      setLoading(true);
      setError(null);
      await socialLogin({
        provider,
        providerId: `mock-${provider}`,
        email: form.email || `${provider}@example.com`,
        firstName: provider.charAt(0).toUpperCase() + provider.slice(1),
        lastName: 'User',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login with provider');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log into your NetWeave Pro account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <View style={styles.socialRow}>
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: '#db4437' }]}
          onPress={() => handleSocial('google')}
        >
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: '#1877f2' }]}
          onPress={() => handleSocial('facebook')}
        >
          <Text style={styles.socialText}>Continue with Facebook</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
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
  socialRow: {
    gap: 12,
    marginBottom: 16,
  },
  socialButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  socialText: {
    color: '#fff',
    fontWeight: '600',
  },
  link: {
    color: '#2563eb',
    textAlign: 'center',
    fontWeight: '600',
  },
  error: {
    color: '#ef4444',
    marginBottom: 12,
  },
});
