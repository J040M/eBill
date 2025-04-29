import { Stack } from "expo-router";
import { ClientProvider } from "./lib/clientContext";

export default function RootLayout() {
  return (
    <ClientProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ClientProvider>
  );
}
