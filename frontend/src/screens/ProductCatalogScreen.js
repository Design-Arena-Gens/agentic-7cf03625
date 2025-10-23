import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api.js';

export default function ProductCatalogScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products');
      setProducts(data.products);
    } catch (err) {
      Alert.alert('Error', 'Unable to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handlePurchase = async (product) => {
    try {
      setLoading(true);
      const { data } = await api.post('/orders', {
        items: [{ productId: product._id, quantity: 1 }],
      });
      Alert.alert('Payment Initiated', 'Complete the payment via Stripe with the client secret delivered.', [
        { text: 'OK' },
      ]);
      return data;
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Unable to start order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  if (loading && !products.length) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={products}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity style={styles.button} onPress={() => handlePurchase(item)}>
            <Text style={styles.buttonText}>Buy & Resell</Text>
          </TouchableOpacity>
        </View>
      )}
      refreshing={loading}
      onRefresh={loadProducts}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 20,
    backgroundColor: '#f3f4f6',
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    color: '#6b7280',
    marginBottom: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});
