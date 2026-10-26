import { Redirect } from "expo-router";

// Keep /admin from exposing the old, unguarded placeholder dashboard.
// The real dashboard performs its own AuthGuard check.
export default function AdminIndex() {
  return <Redirect href="/admin/dashboard" />;
}
