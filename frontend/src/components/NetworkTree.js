import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MAX_DEPTH = 3;

function renderNode(node, depth = 0) {
  if (!node || depth > MAX_DEPTH) return null;

  return (
    <View key={node._id || node.id || node.affiliateId} style={styles.nodeContainer}>
      <View style={[styles.card, { marginLeft: depth * 12 }]}> 
        <Text style={styles.name}>{node.firstName} {node.lastName}</Text>
        <Text style={styles.meta}>Affiliate ID: {node.affiliateId}</Text>
      </View>
      {node.children?.length ? (
        <View style={styles.children}>{node.children.map((child) => renderNode(child, depth + 1))}</View>
      ) : null}
    </View>
  );
}

export default function NetworkTree({ tree }) {
  if (!tree) return null;
  return <View style={styles.container}>{renderNode(tree)}</View>;
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  nodeContainer: {
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#f4f6fb',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    color: '#111827',
  },
  meta: {
    fontSize: 12,
    color: '#6b7280',
  },
  children: {
    marginTop: 4,
    gap: 4,
  },
});
