import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ebill } from './lib/ebill/types';
import { useClient } from './lib/clientContext';

export default function ItemsScreen() {
  const [items, setItems] = useState<Ebill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const client = useClient();

  const loadItems = useCallback(async () => {
    setLoading(true);
    const data = await client.ebill.findAll();
    setItems(data);
    setLoading(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const data = await client.ebill.findAll();
    setItems(data);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.uuid!}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push(`/ebill/${item.uuid}`)}
        >
          <Text style={styles.billNumber}>Bill #{item.bill_number}</Text>
          <Text style={styles.label}>Supplier:</Text>
          <Text style={styles.value}>{item.supplier_label}</Text>

          <View style={styles.row}>
            <Text style={styles.meta}>Due: {new Date(item.due_date).toLocaleDateString()}</Text>
            <Text style={styles.meta}>Total: {item.total.toFixed(2)} €</Text>
          </View>
        </TouchableOpacity>
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  billNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1a73e8',
  },
  label: {
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    fontSize: 14,
    color: '#777',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

