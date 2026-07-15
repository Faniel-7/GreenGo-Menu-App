import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

import Sidebar from "../../components/Sidebar";
import MenuCard from "../../components/MenuCard";
import { menuItems } from "../../data/menu";

export default function MenuScreen() {
  const { category } = useLocalSearchParams();

  const [open, setOpen] = useState(false);

  const items =
    menuItems[category as keyof typeof menuItems] || [];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setOpen(true)}
      >
        <Ionicons
          name="menu"
          size={42}
          color="white"
        />
      </TouchableOpacity>

      <Sidebar
        visible={open}
        onClose={() => setOpen(false)}
      />

      <Text style={styles.title}>GreenGo</Text>

      <Text style={styles.category}>
        {category}
      </Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MenuCard
            image={item.image}
            name={item.name}
            price={item.price}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    paddingTop: 60,
    alignItems: "center",
  },

  menuButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },

  title: {
    color: "#2ecc71",
    fontSize: 32,
    fontWeight: "900",
  },

  category: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 15,
    marginBottom: 20,
  },

  list: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 30,
  },
});