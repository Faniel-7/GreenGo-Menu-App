import { Stack } from "expo-router";
import AuthGuard from "../components/admin/AuthGuard";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}