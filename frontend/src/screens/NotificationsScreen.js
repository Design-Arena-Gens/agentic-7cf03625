import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import api from '../services/api.js';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications);
    } catch (err) {
      // TODO handle error state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={notifications}
      keyExtractor={(item) => item._id}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadNotifications} />}
      renderItem={({ item }) => (
        <View style={[styles.card, item.isRead ? styles.read : styles.unread]}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>
          <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 16, gap: 12 },
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  unread: { backgroundColor: '#fff7ed', borderLeftWidth: 4, borderLeftColor: '#fb923c' },
  read: { backgroundColor: '#ffffff', borderLeftWidth: 4, borderLeftColor: '#9ca3af' },
  title: { fontWeight: '700', color: '#111827' },
  body: { color: '#4b5563' },
  timestamp: { fontSize: 12, color: '#9ca3af' },
});
