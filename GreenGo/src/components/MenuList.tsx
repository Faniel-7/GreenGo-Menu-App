import { View, Text, StyleSheet } from "react-native";

type MenuItem = {
  id: string | number;
  name: string;
  price: string | number;
};

type MenuListProps = {
  items: MenuItem[];
};

export default function MenuList({ items }: MenuListProps) {
  return (
    <View style={styles.container}>
      {items.map((item: MenuItem) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={styles.dots} />

          <Text style={styles.price}>
            {item.price}

            <Text style={styles.etb}> ETB</Text>
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "55%",
    marginTop: 420,
    marginLeft: 30,
    gap: 22,
    zIndex: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    color: "white",
    fontSize: 18,
    width: 150,
    fontWeight: "600",
  },

  dots: {
    flex: 1,
    borderBottomWidth: 1,
    borderStyle: "dotted",
    borderBottomColor: "#666",
    marginHorizontal: 8,
  },

  price: {
    color: "#f5b000",
    fontSize: 22,
    fontWeight: "bold",
  },

  etb: {
    fontSize: 11,
  },
});