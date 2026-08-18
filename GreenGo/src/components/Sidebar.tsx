import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import { useState } from "react";
import { supabase } from "../lib/supabase";


const { width } = Dimensions.get("window");

const isLargeScreen = width >= 768;

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  "Hot Drinks": "cafe",
  Breakfast: "egg",
  "Salads & Soup": "leaf",
  "Juices & Shakes": "wine",
  "Rice, Pasta & Wrap": "nutrition",
  Pizza: "pizza",
  Chinese: "fish",
  "Burger & Sandwich": "fast-food",
};


type SidebarProps = {
  visible: boolean;
  onClose: () => void;
};

export default function Sidebar({
  visible,
  onClose,
}: SidebarProps) {
  const slideAnim = useRef(
    new Animated.Value(-300)
  ).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const [categories, setCategories] = useState<any[]>([]);
  
const fetchCategories = async () => {

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("id");

  if (error) {
    console.log("Category error:", error);
    return;
  }

  setCategories(data);

};

useEffect(() => {
    fetchCategories();
}, []);


const getCategoryIcon = (name: string): string => {
  const categoryName = name.toLowerCase();

  if (categoryName.includes("pizza")) {
    return "🍕";
  }

  if (categoryName.includes("burger") || categoryName.includes("sandwich")) {
    return "🍔";
  }

  if (categoryName.includes("hot") || categoryName.includes("coffee")) {
    return "☕";
  }

  if (categoryName.includes("breakfast")) {
    return "🍳";
  }

  if (categoryName.includes("salad") || categoryName.includes("soup")) {
    return "🥗";
  }

  if (categoryName.includes("juice") || categoryName.includes("shake")) {
    return "🥤";
  }

  if (
    categoryName.includes("rice") ||
    categoryName.includes("pasta") ||
    categoryName.includes("wrap")
  ) {
    return "🍝";
  }

  if (categoryName.includes("chinese")) {
    return "🥡";
  }

  return "🍽️";
};

  if (!visible) return null;

  return (
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <Animated.View
  style={[
    styles.sidebar,
    {
      transform: [{ translateX: slideAnim }],
    },
  ]}
>
  <ScrollView
    showsVerticalScrollIndicator={false}
  >
        <Text style={styles.logo}>GreenGo</Text>

        {categories.map((category: any) => (
          <TouchableOpacity
            key={category.name}
            style={styles.item}
            onPress={() => {
              router.push(`/menu/${category.slug}` as any);
            }}
          >
            <Text style={{ fontSize: isLargeScreen ? 20 : 30}}>
              {getCategoryIcon(category.name)}
            </Text>

            <Text style={styles.text}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 100,
  },

  sidebar: {
    width: isLargeScreen ? 270 : 290,
    height: "100%",
    backgroundColor: isLargeScreen ? "rgba(20,20,20,0.4)" : "rgba(20,20,20,0.9)",
    paddingTop: 90,
    paddingHorizontal: 24,
    zIndex: 9999,
    overflow: "hidden",
  },

  logo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#2ecc71",
    marginBottom: 40,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
  },

  text: {
    fontSize: isLargeScreen ? 18 : 22,
    fontWeight: "900",
    color: "#ffffff",
    marginLeft: 18,
  },
});