import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import api from '../services/api.js';

const initialForm = {
  title: '',
  description: '',
  price: '',
  type: 'digital',
  inventory: '',
};

export default function AdminScreen() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.products);
    } catch (err) {
      Alert.alert('Error', 'Unable to load products for admin');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onCreate = async () => {
    try {
      setLoading(true);
      await api.post('/products', {
        ...form,
        price: Number(form.price),
        inventory: Number(form.inventory),
      });
      setForm(initialForm);
      loadProducts();
      Alert.alert('Success', 'Product created');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Unable to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Product Manager</Text>
      <View style={styles.form}>
        {Object.keys(initialForm).map((field) => (
          <TextInput
            key={field}
            value={form[field]}
            style={styles.input}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            onChangeText={(text) => setForm((prev) => ({ ...prev, [field]: text }))}
          />
        ))}
        <TouchableOpacity style={styles.button} onPress={onCreate} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Create Product'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>${item.price.toFixed(2)} · {item.type}</Text>
            <Text style={styles.meta}>Inventory: {item.inventory}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontWeight: '700',
    color: '#111827',
  },
  meta: {
    color: '#6b7280',
    marginTop: 4,
  },
});
