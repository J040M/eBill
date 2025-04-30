import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useClient } from './lib/clientContext';
import { Ebill } from './lib/ebill/types';

export default function ItemDetail() {
  const { uuid } = useLocalSearchParams();
  const [item, setItem] = useState<Ebill | null>(null);
  const client = useClient();

  useEffect(() => {
    if (typeof uuid === 'string') {
      client.ebill.find(uuid).then(setItem);
    }
  }, [uuid]);

  if (!item) {
    return (
      <View style={styles.centered}>
        <Text>Loading item...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Bill #{item.bill_number}</Text>
      <Text style={styles.label}>UUID:</Text>
      <Text style={styles.value}>{item.uuid}</Text>

      <Text style={styles.label}>Supplier:</Text>
      <Text style={styles.value}>{item.supplier_label}</Text>

      <Text style={styles.label}>Issue Date:</Text>
      <Text style={styles.value}>{new Date(item.issue_date).toLocaleDateString()}</Text>

      <Text style={styles.label}>Due Date:</Text>
      <Text style={styles.value}>{new Date(item.due_date).toLocaleDateString()}</Text>

      <Text style={styles.section}>Items</Text>
      {item.items.map((itm, index) => (
        <View key={index} style={styles.box}>
          <Text style={styles.value}>• {itm.label}</Text>
          <Text style={styles.subValue}>Qty: {itm.quantity} | Unit: {itm.price_unit}</Text>
        </View>
      ))}

      <Text style={styles.section}>Taxes</Text>
      {item.tax.map((t, index) => (
        <View key={index} style={styles.box}>
          <Text style={styles.value}>• {t.label}: {t.value}%</Text>
        </View>
      ))}

      <Text style={styles.label}>Total:</Text>
      <Text style={styles.total}>{item.total.toFixed(2)} €</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
  },
  subValue: {
    fontSize: 14,
    color: '#555',
  },
  section: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 4,
  },
  box: {
    marginVertical: 6,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#1a73e8',
  },
});
