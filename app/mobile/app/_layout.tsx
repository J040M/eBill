import { Stack } from "expo-router";
import { ClientProvider } from "./lib/clientContext";
import './locale/i18n'

export default function RootLayout() {
  return (
    <ClientProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ClientProvider>
  );
}
