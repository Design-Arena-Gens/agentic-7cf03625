import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext.js';
import api from '../services/api.js';
import StatCard from '../components/StatCard.js';
import NetworkTree from '../components/NetworkTree.js';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsResponse, treeResponse] = await Promise.all([
        api.get('/network/stats'),
        api.get('/network/tree?depth=2'),
      ]);
      setStats(statsResponse.data.stats);
      setTree(treeResponse.data.tree);
    } catch (err) {
      // TODO: surface error state to user
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
    >
      <Text style={styles.heading}>Welcome, {user?.firstName}</Text>
      <Text style={styles.subheading}>Affiliate ID: {user?.affiliateId}</Text>

      <View style={styles.statsGrid}>
        <StatCard label="Direct Affiliates" value={stats?.directAffiliates ?? 0} />
        <StatCard label="Total Team" value={stats?.totalAffiliates ?? 0} accent="#14b8a6" />
        <StatCard
          label="Total Sales"
          value={`$${Number(user?.earnings?.totalSales || 0).toFixed(2)}`}
          accent="#f97316"
        />
      </View>

      <Text style={styles.sectionTitle}>Downline Tree</Text>
      <NetworkTree tree={tree} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subheading: {
    color: '#6b7280',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
});
