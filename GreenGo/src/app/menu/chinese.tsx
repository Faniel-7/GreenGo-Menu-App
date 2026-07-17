import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";


const chineseItems = [
  { name: "CHINESE BURGER", price: "500" },
  { name: "CHINESE CRISPY", price: "750" },
  { name: "DUMPLING", price: "700" },
  { name: "SWEET & SOUR CHICKEN", price: "550" },
  { name: "NOODLES", price: "550" },
  { name: "NOODLES WITH BEEF", price: "600" },
  { name: "SPICY CHICKEN", price: "1300" },
  { name: "BRAISED BEEF", price: "600" },
  { name: "EGG WITH MEAT", price: "500" },
];

export default function Category() {
  const { category } = useLocalSearchParams();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* LEFT SIDE */}
        <TouchableOpacity
          style={styles.settings}
          onPress={() => setSidebarVisible(!sidebarVisible)}>
            <Ionicons
            name="menu"
            size={32}
            color="#fff"
            />
            </TouchableOpacity>
            
            <Sidebar
            visible={sidebarVisible}
            onClose={() => setSidebarVisible(false)}
            />
            

        <View style={styles.leftSide}>
          <Image
            source={require("../../../assets/images/logo.png")}
            style={styles.logo}
          />

          <Text style={styles.titleWhite}>TASTE OF</Text>

          <Text style={styles.titleYellow}>GREENGO</Text>

          <Text style={styles.subtitle}>
            CAFE • LOUNGE • FINE DINING
          </Text>

          <Text style={styles.menuTitle}>
            {String(category).toUpperCase()} MENU
          </Text>

          <View style={styles.underline} />

          {chineseItems.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.name}
              </Text>

              <View style={styles.dots} />

              <View style={styles.priceBox}>
                <Text style={styles.price}>
                  {item.price}
                </Text>

                <Text style={styles.etb}>
                  ETB
                </Text>
              </View>
            </View>
          ))}

          {/* FOOTER */}

          <View style={styles.footer}>

            <View style={styles.footerRow}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="call"
                  size={24}
                  color="white"
                />
              </View>

              <View>
                <Text style={styles.footerTitle}>
                  ORDER NOW
                </Text>

                <Text style={styles.footerText}>
                  +251 912 345 678
                </Text>
              </View>
            </View>

            <View style={styles.footerLine} />

            <View style={styles.footerRow}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="bicycle"
                  size={24}
                  color="white"
                />
              </View>

              <View>
                <Text style={styles.footerTitle}>
                  FAST DELIVERY
                </Text>

                <Text style={styles.footerText}>
                  GreenGo
                </Text>
              </View>
            </View>

          </View>
        </View>

        {/* RIGHT SIDE */}

        <View style={styles.rightSide}>

          <Svg style={styles.wave} viewBox="0 0 120 1500">
            <Path
              d="
                M 60 0
                C 110 220, 20 350, 75 550
                C 110 720, 20 930, 80 1180
                C 100 1320, 60 1450, 70 1500
              "
              stroke="#f4b400"
              strokeWidth="6"
              fill="none"
            />
          </Svg>

          <Image
            source={require("../../../assets/images/pizza-10.png")}
            style={styles.pizzaTop}
          />

          <Image
            source={require("../../../assets/images/pizza-8.png")}
            style={styles.pizzaMiddle}
          />

          <Image
            source={require("../../../assets/images/pizza-7.png")}
            style={styles.pizzaBottom}
          />

          
<Image
            source={require("../../../assets/images/leaf-1.png")}
            style={styles.leaf1}
          />

          <Image
            source={require("../../../assets/images/leaf-2.png")}
            style={styles.leaf2}
          />

          <Image
            source={require("../../../assets/images/leaf-3.png")}
            style={styles.leaf3}
          />

          <View style={[styles.badge, styles.badgeTop]}>
            <Text style={styles.badgeText}>
              FRESH{"\n"}COOKED
            </Text>
          </View>

          <View style={[styles.badge, styles.badgeBottom]}>
            <Text style={styles.badgeText}>
              100%{"\n"}QUALITY
            </Text>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030303",
  },

  content: {
    flexDirection: "row",
  },

  leftSide: {
    width: "58%",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 8,
  },

  rightSide: {
    width: "42%",
    position: "relative",
    overflow: "hidden",
  },

  logo: {
    width: 105,
    height: 105,
    resizeMode: "contain",
    marginBottom: 10,
    left: 30,
  },

  titleWhite: {
    color: "white",
    fontSize: 40,
    fontWeight: "900",
    fontFamily: "helvetica",
  },

  titleYellow: {
    color: "#f4b400",
    fontSize: 45,
    fontWeight: "900",
    fontFamily: "helvetica",
    height:55,
    marginBottom: 15,
  },

  subtitle: {
    color: "#d6d6d6",
    fontSize: 11,
    letterSpacing: 4,
    marginBottom: 45,
    fontFamily: "verdana",
  },

  menuTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "900",
    fontFamily: "verdana",
  },

  underline: {
    width: 190,
    height: 4,
    backgroundColor: "#f4b400",
    marginTop: 8,
    marginBottom: 35,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    fontFamily: "verdana",
  },

  itemName: {
    color: "white",
    fontWeight: "900",
    fontSize: 13,
    width: "55%",
    fontFamily: "verdana",
  },

  dots: {
    flex: 1,
    borderBottomWidth: 2,
    borderColor: "#ffaa00",
    borderStyle: "dotted",
    marginHorizontal: -2,
  },

  priceBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    width: 70,
    justifyContent: "flex-end",
  },

  price: {
    color: "#f4b400",
    fontSize: 15,
    fontWeight: "900",
    fontFamily: "verdana",
  },

  etb: {
    color: "#f4b400",
    fontSize: 11,
    marginLeft: 3,
    marginBottom: 2,
    fontFamily: "verdana",
  },

  wave: {
    position: "absolute",
    left: -20,
    top: -30,
    width: 140,
    height: 1500,
  },

  pizzaTop: {
    position: "absolute",
    top: 50,
    right: -80,
    width: 330,
    height: 330,
    resizeMode: "contain",
  },

  pizzaMiddle: {
    position: "absolute",
    top: 420,
    right: -50,
    width: 240,
    height: 240,
    resizeMode: "contain",
  },

  pizzaBottom: {
    position: "absolute",
    bottom: 95,
    right: -40,
    width: 220,
    height: 220,
    resizeMode: "contain",
  },

  badge: {
    position: "absolute",
    width: 63,
    height: 63,
    borderRadius: 90,
    backgroundColor: "#ffc400",
    justifyContent: "center",
    alignItems: "center",
    borderBlockColor: "#000000",
    borderWidth: 2,
    fontWeight: "bold",
    fontFamily: "verdana",
  },

  badgeTop: {
    top: 370,
    left: 19,
  },

  badgeBottom: {
    top: 1020,
    left: 25,
  },

  badgeText: {
    color: "#00b90c",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
    fontFamily: "verdana",
  },

  leaf1: {
    position: "absolute",
    top: 5,
    left: 52,
    width: 70,
    height: 70,
    resizeMode: "contain",
  },

  leaf2: {
    position: "absolute",
    top: 1015,
    left: 45,
    width: 80,
    height: 80,
    resizeMode: "contain",
  },

  leaf3: {
    position: "absolute",
    bottom: 350,
    left: 5,
    width: 60,
    height: 60,
    resizeMode: "contain",
  },

  footer: {
    marginTop: 40,
    marginBottom: 30,
  },

  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1ecb00",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  footerTitle: {
    color: "#f4b400",
    fontSize: 18,
    fontWeight: "900",
  },

  footerText: {
    color: "white",
    fontSize: 14,
  },

  footerLine: {
    width: 180,
    height: 1,
    backgroundColor: "#f4b400",
    marginVertical: 6,
  },

  settings: {
    position: "absolute",
    top: 10,
    left: -2,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    fontFamily: "verdana",
  },
});