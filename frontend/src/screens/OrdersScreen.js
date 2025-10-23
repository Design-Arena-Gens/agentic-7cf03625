import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import api from '../services/api.js';

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data.orders);
    } catch (err) {
      // TODO: Provide user feedback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={orders}
      keyExtractor={(item) => item._id}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadOrders} />}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.id}>Order #{item._id.slice(-6)}</Text>
            <Text style={[styles.status, styles[`status_${item.status}`]]}>{item.status}</Text>
          </View>
          {item.items.map((orderItem) => (
            <View key={orderItem.product._id} style={styles.itemRow}>
              <Text style={styles.product}>{orderItem.product.title}</Text>
              <Text style={styles.meta}>x{orderItem.quantity}</Text>
              <Text style={styles.meta}>${orderItem.unitPrice.toFixed(2)}</Text>
            </View>
          ))}
          <Text style={styles.total}>Total ${item.totalAmount.toFixed(2)}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: '#f3f4f6' },
  listContent: { padding: 16, gap: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  id: { fontWeight: '700', color: '#111827' },
  status: { textTransform: 'capitalize', fontWeight: '600' },
  status_pending: { color: '#f59e0b' },
  status_paid: { color: '#16a34a' },
  status_fulfilled: { color: '#2563eb' },
  status_refunded: { color: '#ef4444' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between' },
  product: { fontWeight: '600', flex: 1 },
  meta: { color: '#6b7280', marginLeft: 12 },
  total: { textAlign: 'right', fontWeight: '700', color: '#111827' },
});
