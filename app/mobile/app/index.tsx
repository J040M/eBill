import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export default function Index() {
  const router = useRouter();
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.title')}</Text>

      <Button title={t('home.actions.camera')} onPress={() => router.push("/camera")} />
      <Button title={t('home.actions.login')} onPress={() => router.push("/login")} />
      <Button title={t('home.actions.settings')} onPress={() => router.push("/settings")} />
      <Button title={t('home.actions.ebill')} onPress={() => router.push("/ebill")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    fontSize: 18,
    color: "blue",
    textDecorationLine: "underline",
  },
});
