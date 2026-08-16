import { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

import CategoryMenuTemplate from "../../components/CategoryMenuTemplate";
import { supabase } from "../../lib/supabase";

type MenuItem = {
  id: number | string;
  name: string;
  price: number | string;
};

export default function Pizza() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPizzaItems();
  }, []);

  async function loadPizzaItems() {
    try {
      const { data, error } = await supabase
        .from("category_items")
        .select("*")
        .eq("category_id", 5)
        .eq("active", true)
        .order("id", { ascending: true });

      if (error) {
        console.log("Pizza items error:", error);
        return;
      }

      setItems(data || []);
    } catch (error) {
      console.log("Pizza loading error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#f4b400" />
      </View>
    );
  }

  return (
    <CategoryMenuTemplate
      categoryName="Pizza"
      items={items}

      /* ORIGINAL PIZZA IMAGES */
      pizzaImages={[
        require("../../../assets/images/pizza-10.png"),
        require("../../../assets/images/pizza-8.png"),
        require("../../../assets/images/pizza-7.png"),
      ]}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#030303",
  },
});