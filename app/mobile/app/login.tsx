import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useClient } from "./lib/clientContext";

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const client = useClient()

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert(t('alerts.error'), t('alerts.login.missing_inputs'));
      return;
    }

    try {
      client.auth.login(email, password)
    } catch (e) {
      Alert.alert(t('alerts.api.fail_title'), t('alerts.api.fail'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('login.title')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('login.email')}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder={t('login.password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
