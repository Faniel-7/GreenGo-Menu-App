import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

import { useEffect, useState } from "react";

import AdminLayout from "../../components/admin/AdminLayout";
import AuthGuard from "../../components/admin/AuthGuard";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {

  const router = useRouter();

  const [stats, setStats] = useState({
    menuItems: 0,
    promotions: 0,
    discounts: 0,
    happyHours: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {

    try {

      const [
        menuItems,
        promotions,
        discounts,
        happyHours,
      ] = await Promise.all([

        supabase
          .from("categories")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("offers")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("type", "promotion"),

        supabase
          .from("offers")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("type", "discount"),

        supabase
          .from("offers")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("type", "happy_hour"),

      ]);

      setStats({
        menuItems: menuItems.count || 0,
        promotions: promotions.count || 0,
        discounts: discounts.count || 0,
        happyHours: happyHours.count || 0,
      });

    } catch (error) {

      console.log(error);

    }

  }

  const cards = [

    {
  title: "Menu Items",
  icon: "📋",
  value: stats.menuItems,
  description: "Manage categories and foods",
},

    {
      title: "Promotions",
      icon: "🎉",
      value: stats.promotions,
      description: "Create restaurant promotions",
    },

    {
      title: "Discounts",
      icon: "🏷",
      value: stats.discounts,
      description: "Customer specific discounts",
    },

    {
      title: "Happy Hours",
      icon: "⏰",
      value: stats.happyHours,
      description: "Time based offers",
    }

  ];

  return (

    <AuthGuard>

      <AdminLayout>

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >

          <Text style={styles.title}>
            Dashboard
          </Text>

          <Text style={styles.subtitle}>
            Manage GreenGo Restaurant
          </Text>

          <View style={styles.grid}>
            {cards.map((card, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => {
                  if (card.title === "Menu Items") {
                    router.push("/admin/categories");
                  }
                  else if (card.title === "Happy Hours") {
                    router.push("/admin/offers/happy-hours");
                  } else if (card.title === "Discounts") {
                    router.push("/admin/offers/discounts");
                  } else if (card.title === "Promotions") {
                    router.push("/admin/offers/promotion");
                  }
                }}
              >
                <Text style={styles.icon}>{card.icon}</Text>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.count}>{card.value}</Text>
                <Text style={styles.description}>{card.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>

      </AdminLayout>

    </AuthGuard>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#030303",
    padding: 20,
  },

  title: {
    color: "#f4b400",
    fontSize: 35,
    fontWeight: "900",
  },

  subtitle: {
    color: "white",
    marginBottom: 30,
    fontSize: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },

  card: {
    backgroundColor: "#111",
    width: "47%",
    height: 180,
    padding: 20,
    borderRadius: 15,
    justifyContent: "center",
  },

  icon: {
    fontSize: 35,
  },
cardTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 10,
  },

  count: {
    color: "#f4b400",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 8,
  },

  description: {
    color: "#aaa",
    marginTop: 5,
  },

});