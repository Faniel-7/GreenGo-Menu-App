import { View, Text, Image, StyleSheet } from "react-native";

type Props = {
  image: any;
  name: string;
  price: string;
};

export default function MenuCard({
  image,
  name,
  price,
}: Props) {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>

        <Text style={styles.price}>{price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "92%",
    height: 120,
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    flexDirection: "row",
  },

  image: {
    width: 120,
    height: "100%",
  },

  info: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },

  name: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  price: {
    color: "#2ecc71",
    fontSize: 18,
    marginTop: 10,
    fontWeight: "700",
  },
});