import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import CategoryMenuTemplate from "../../components/CategoryMenuTemplate";
import { supabase } from "../../lib/supabase";

type MenuItem = {
  id: number | string;
  name: string;
  price: number | string;
  section?: string | null;
};

type CategoryImage = {
  id: number;
  image_url: string;
};

type Category = {
  id: number;
  name: string;
  slug: string;
  active: boolean;
  menu_type?: string | null;
};

export default function DynamicCategoryMenu() {
  const { slug } = useLocalSearchParams<{
    slug: string;
  }>();

  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [images, setImages] = useState<CategoryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (slug) {
      loadCategory();
    }
  }, [slug]);

  async function loadCategory() {
    try {
      setLoading(true);
      setError("");

      // 1. Load category using slug
      const {
        data: categoryData,
        error: categoryError,
      } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .single();

      if (categoryError) {
        throw categoryError;
      }

      if (!categoryData) {
        throw new Error("Category not found.");
      }

      setCategory(categoryData);

      // 2. Load category items
      const {
        data: itemsData,
        error: itemsError,
      } = await supabase
        .from("category_items")
        .select("*")
        .eq("category_id", categoryData.id)
        .eq("active", true)
        .order("id", {
          ascending: true,
        });

      if (itemsError) {
        throw itemsError;
      }

      setItems(itemsData || []);

      // 3. Load category images
      const {
        data: imagesData,
        error: imagesError,
      } = await supabase
        .from("category_images")
        .select("*")
        .eq("category_id", categoryData.id)
        .order("id", {
          ascending: true,
        });

      if (imagesError) {
        throw imagesError;
      }

      setImages(imagesData || []);
    } catch (err: any) {
      console.log("Dynamic category error:", err);

      setError(
        err?.message || "Could not load category."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#f4b400"
        />

        <Text style={styles.loadingText}>
          Loading menu...
        </Text>
      </View>
    );
  }

  if (error || !category) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorTitle}>
          Menu not found
        </Text>

        <Text style={styles.errorText}>
          {error || "This category does not exist."}
        </Text>
      </View>
    );
  }

  return (
    <CategoryMenuTemplate
      categoryName={category.name}
      items={items}
      images={images.map(
        (image) => image.image_url
      )}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "#030303",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#f4b400",
    marginTop: 15,
    fontSize: 16,
    fontWeight: "700",
  },

  error: {
    flex: 1,
    backgroundColor: "#030303",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  errorTitle: {
    color: "#f4b400",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 10,
  },

  errorText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
  },
});