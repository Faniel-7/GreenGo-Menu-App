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

const categories = Object.keys(icons);

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

        {categories.map((category: string) => (
          <TouchableOpacity
            key={category}
            style={styles.item}
            onPress={() => {
              if (category === "Pizza") {
                router.push("/menu/pizza" );
              }
              else if (category === "Burger & Sandwich") {
                router.push("/menu/burger-and-sandwich" );
              }
              else if (category === "Chinese") {
                router.push("/menu/chinese" as any);
              }
              else if (category === "Breakfast") {
                router.push("/menu/breakfast" as any);
              }
              else if (category === "Salads & Soup") {
                router.push("/menu/salads-and-soup" as any);
              }
              else if (category === "Hot Drinks") {
                router.push("/menu/hot-drinks" as any);
              }
              else if (category === "Juices & Shakes") {
                router.push("/menu/juice-and-soft-drinks" as any);
              }
              else if (category === "Rice, Pasta & Wrap") {
                router.push("/menu/rice-pasta-wrap" as any);
              }
              onClose();
            }}
          >
            <Ionicons
              name={icons[category]}
              size={32}
              color="#2ecc71"
            />

            <Text style={styles.text}>
              {category}
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