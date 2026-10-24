import { Redirect } from "expo-router";

// The legacy Add Item screen was a nonfunctional prototype.
// Use the real, protected menu-management screen instead.
export default function AddItemRedirect() {
  return <Redirect href="/admin/categories" />;
}
