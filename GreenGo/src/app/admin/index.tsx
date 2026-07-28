import { Ionicons } from "@expo/vector-icons";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomTabs from "../../components/admin/AdminBottomTabs";

const { width } = Dimensions.get("window");

const isLargeScreen = width >= 768;

const dashboardCards = [
  {
    title: "Menu Items",
    value: "124",
    icon: "restaurant",
  },
  {
    title: "Categories",
    value: "8",
    icon: "grid",
  },
  {
    title: "Discounts",
    value: "5",
    icon: "pricetag",
  },
  {
    title: "Happy Hours",
    value: "2",
    icon: "time",
  },
];

export default function AdminScreen() {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>GREENGO ADMIN</Text>

        <TouchableOpacity style={styles.profileButton}>
          <Ionicons
            name="person"
            size={26}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Dashboard
      </Text>

      <View style={styles.cardContainer}>
        {dashboardCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
          >
            <Ionicons
              name={card.icon as any}
              size={34}
              color="#f4b400"
            />

            <Text style={styles.cardValue}>
              {card.value}
            </Text>

            <Text style={styles.cardTitle}>
              {card.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="add-circle" size={26} color="#1ecb00" />
          <Text style={styles.actionText}>Add Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="pricetag" size={26} color="#1ecb00" />
          <Text style={styles.actionText}>Discounts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="time" size={26} color="#1ecb00" />
          <Text style={styles.actionText}>Happy Hours</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings" size={26} color="#1ecb00" />
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
      </View>
      <BottomTabs />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030303",
    paddingHorizontal: isLargeScreen ? 30 : 18,
    paddingTop: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    color: "#f4b400",
    fontSize: isLargeScreen ? 34 : 28,
    fontWeight: "900",
  },

  subtitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },

  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: isLargeScreen ? "23%" : "48%",
    backgroundColor: "#1a1a1a",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
  },

  cardValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 10,
  },

  cardTitle: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 6,
  },

  sectionTitle: {
    color: "#f4b400",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 20,
    marginBottom: 15,
  },

  actionsContainer: {
    gap: 12,
    marginBottom: 30,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 18,
    borderRadius: 16,
  },
actionText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 15,
  },
});