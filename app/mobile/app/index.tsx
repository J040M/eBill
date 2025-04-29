import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's scan some documents</Text>
      
      <Button title="Open Camera" onPress={() => router.push("/camera")} />
      <Button title="Open Login" onPress={() => router.push("/login")} />
      <Button title="Open Settings" onPress={() => router.push("/settings")} />
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
