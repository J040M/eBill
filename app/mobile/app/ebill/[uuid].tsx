import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useClient } from '../lib/clientContext';
import { Ebill } from '../lib/ebill/types';
import { useTranslation } from 'react-i18next';

export default function ItemDetail() {
  const { t } = useTranslation();
  const { uuid } = useLocalSearchParams();
  const [item, setItem] = useState<Ebill | null>(null);
  const client = useClient();

  useEffect(() => {
    console.log('getting one item')
    console.log('UUID', uuid)
    if (typeof uuid === 'string') {
      client.ebill.find(uuid).then((ebill)=> {
        setItem(ebill)
      });
    }
  }, [uuid]);

  if (!item) {
    return (
      <View style={styles.centered}>
        <Text>{t('ebill.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{t('ebill.form.bill_number')}{item.bill_number}</Text>
      <Text style={styles.label}>{t('ebill.form.id')}</Text>
      <Text style={styles.value}>{item.uuid}</Text>

      <Text style={styles.label}>{t('ebill.form.supplier')}</Text>
      <Text style={styles.value}>{item.supplier_label}</Text>

      <Text style={styles.label}>{t('ebill.form.issue_date')}</Text>
      <Text style={styles.value}>{new Date(item.issue_date).toLocaleDateString()}</Text>

      <Text style={styles.label}>{t('ebill.form.due_date')}</Text>
      <Text style={styles.value}>{new Date(item.due_date).toLocaleDateString()}</Text>

      <Text style={styles.section}>{t('ebill.form.items.title')}</Text>
      {item.items.map((itm, index) => (
        <View key={index} style={styles.box}>
          <Text style={styles.value}>{t('ebill.form.items.label')} {itm.label}</Text>
          <Text style={styles.subValue}>{t('ebill.form.items.quantity')} {itm.quantity} | {t('ebill.form.items.amount')} {itm.price_unit}</Text>
        </View>
      ))}

      <Text style={styles.section}>{t('ebill.form.tax.title')}</Text>
      {item.tax.map((t, index) => (
        <View key={index} style={styles.box}>
          <Text style={styles.value}>• {t.label}: {t.value}%</Text>
        </View>
      ))}

      <Text style={styles.label}>{t('ebill.form.total')}</Text>
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
