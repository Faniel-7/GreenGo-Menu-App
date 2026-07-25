import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Dimensions } from "react-native";
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

const { width } = Dimensions.get("window");

const isMobile = width < 768;

const isTablet = width >= 768 && width < 1200;

const isDesktop = width >= 1200;

const isLargeScreen = width >= 768;



export default function CategoryScreen() {
  const { category } = useLocalSearchParams();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [hotDrinkItems, setHotDrinkItems] = useState<any[]>([]);

  async function fetchHotDrinks() {
  const { data, error } = await supabase
    .from("category_items")
    .select("*")
    .eq("category_id", 7)
    .eq("active", true)
    .order("id");

  if (error) {
    console.log(error);
    return;
  }

  setHotDrinkItems(data);
}

useEffect(() => {
  fetchHotDrinks();
}, []);

const coffeeItems = hotDrinkItems.filter(
  (item) => item.section === "Coffee Items"
);

const specialDrinkItems = hotDrinkItems.filter(
  (item) => item.section === "Special Drink Items"
);

const teaItems = hotDrinkItems.filter(
  (item) => item.section === "Tea Items"
);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {
  isLargeScreen && (
    <View style={styles.DesktopDevider} />
  )
}

        {isMobile && (
  <TouchableOpacity
    style={styles.settings}
    onPress={() => setSidebarVisible(!sidebarVisible)}
  >
    <Ionicons
      name="menu"
      size={32}
      color="#fff"
    />
  </TouchableOpacity>
)}
            
            <Sidebar
  visible={isLargeScreen ? true : sidebarVisible}
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

          <Text style={styles.sectionTitle}>
  COFFEE SELECTION
</Text>

{coffeeItems.map((item, index) => (
  <View key={index} style={styles.itemRow}>
    <Text style={styles.itemName}>{item.name}</Text>

    <View style={styles.dots} />

    <View style={styles.priceBox}>
      <Text style={styles.price}>{item.price}</Text>
      <Text style={styles.etb}>ETB</Text>
    </View>
  </View>
))}

<Text style={[styles.sectionTitle, { marginTop: 30 }]}>
  COFFEE & MILK
</Text>

{specialDrinkItems.map((item, index) => (
  <View key={index} style={styles.itemRow}>
    <Text style={styles.itemName}>{item.name}</Text>

    <View style={styles.dots} />

    <View style={styles.priceBox}>
      <Text style={styles.price}>{item.price}</Text>
      <Text style={styles.etb}>ETB</Text>
    </View>
  </View>
))}

<Text style={[styles.sectionTitle, { marginTop: 30 }]}>
  HOT TEA SELECTION
</Text>

{teaItems.map((item, index) => (
  <View key={index} style={styles.itemRow}>
    <Text style={styles.itemName}>{item.name}</Text>

    <View style={styles.dots} />

    <View style={styles.priceBox}>
      <Text style={styles.price}>{item.price}</Text>
      <Text style={styles.etb}>ETB</Text>
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
        {isMobile && (
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
          )}

          {isLargeScreen && (
                                  <View>
                                    <Image
                                      source={require("../../../assets/images/geen-glow.png")}
                                      style={styles.glowTop}
                                    />
                              
                                    <Image
                                      source={require("../../../assets/images/geen-glow.png")}
                                      style={styles.glowBottom}
                                    />
                              
                                    <Image
                                      source={require("../../../assets/images/tomato2.png")}
                                      style={styles.tomato1}
                                    />
                              
                                    <Image
                                      source={require("../../../assets/images/tomato1.png")}
                                      style={styles.tomato2}
                                    />
                              
                                    <Image
                                      source={require("../../../assets/images/chilli1.png")}
                                      style={styles.olive1}
                                    />
                              
                                    <Image
                                      source={require("../../../assets/images/olive.png")}
                                      style={styles.olive2}
                                    />
                              
                                    <Image
                                      source={require("../../../assets/images/cheese.png")}
                                      style={styles.cheese1}
                                    />
                              
                                    <Image
                                      source={require("../../../assets/images/strawberry.png")}
                                      style={styles.cheese2}
                                    />
                              
                                    <Image
                                      source={require("../../../assets/images/sparkle.png")}
                                      style={styles.sparkle1}
                                    />
                              
                                    <Image
                                      source={require("../../../assets/images/green2.png")}
                                      style={styles.sparkle2}
                                    />
                                  </View>
                                )}

          <Image
            source={require("../../../assets/images/coffee/coffee4.png")}
            style={styles.coffeeTop}
          />

          <Image
            source={require("../../../assets/images/coffee/coffee8.png")}
            style={styles.coffeeMiddle}
          />

          <Image
            source={require("../../../assets/images/coffee/coffee7.png")}
            style={styles.coffeeBottom}
          />

          <Image
            source={require("../../../assets/images/coffee/coffee6.png")}
            style={styles.coffeeBottom2}
          />

          <Image
            source={require("../../../assets/images/coffee/coffee2.png")}
            style={styles.coffeeBottom3}
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
  width: isDesktop ? "52%" : "58%",
  paddingTop: isDesktop ? 40 : 20,
  paddingLeft: isDesktop ? 350 : 20,
  paddingRight: 8,
},

  rightSide: {
  width: isDesktop ? "48%" : "42%",
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

  sectionTitle: {
    color: "#f4b400",
    fontSize: 22,
    fontWeight: "900",
    fontFamily: "verdana",
    marginBottom: 18,
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
    fontSize: isLargeScreen ? 17 : 13,
    width: "55%",
    fontFamily: "verdana",
  },

  dots: {
    flex: 1,
    borderBottomWidth: 2,
    borderColor: "#ffaa00",
    borderStyle: "dotted",
    marginHorizontal: 0,
  },

  priceBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    width: 70,
    justifyContent: "flex-end",
  },

  price: {
    color: "#f4b400",
    fontSize: isLargeScreen ? 17 : 15,
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

  coffeeTop: {
  position: "absolute",
  top: isDesktop ? 70 : 20,
  right: isDesktop ? 120 : -80,
  width: isDesktop ? 520 : 330,
  height: isDesktop ? 520 : 330,
  resizeMode: "contain",
},

  coffeeMiddle: {
  position: "absolute",
  top: isDesktop ? 550 : 420,
  right: isDesktop ? 120 : -40,
  width: isDesktop ? 400 : 280,
  height: isDesktop ? 400 : 280,
  resizeMode: "contain",
},

  coffeeBottom: {
  position: "absolute",
  bottom: isDesktop ? 0 : 0,
  right: isDesktop ? 150 : -40,
  width: isDesktop ? 350 : 320,
  height: isDesktop ? 350 : 320,
  resizeMode: "contain",
},

  coffeeBottom2: {
  position: "absolute",
  bottom: isDesktop ? -20 : 715,
  right: isDesktop ? 80 : -70,
  width: isDesktop ? 520 : 310,
  height: isDesktop ? 480 : 210,
  resizeMode: "contain",
},

coffeeBottom3: {
  position: "absolute",
  bottom: isDesktop ? 430 : 395,
  right: isDesktop ? 120 : -10,
  width: isDesktop ? 320 : 220,
  height: isDesktop ? 320 : 220,
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
    top: 25,
    left: -20,
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
    bottom: 320,
    left: 8,
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

  glowTop: {
  position: "absolute",
  top: 750,
  right: 10,
  width: 400,
  height: 400,
  opacity: 0,
},

glowBottom: {
  position: "absolute",
  bottom: 0,
  right: -50,
  width: 420,
  height: 420,
  opacity: 0.45,
},

tomato1: {
  position: "absolute",
  top: 20,
  left: 480,
  width: 105,
  height: 105,
},

tomato2: {
  position: "absolute",
  top: 570,
  left: 30,
  width: 100,
  height: 100,
},

olive1: {
  position: "absolute",
  top: 250,
  right: 420,
  width: 135,
  height: 135,
},

olive2: {
  position: "absolute",
   top: 250,
  right: 90,
  width: 135,
  height: 135,
},

cheese1: {
  position: "absolute",
   top: 80,
  right: 490,
  width: 135,
  height: 135,
},

cheese2: {
  position: "absolute",
  top: 948,
  right: 230,
  width: 65,
  height: 65,
},

sparkle1: {
  position: "absolute",
  top: 420,
  left: 180,
  width: 450,
  height: 450,

},

sparkle2: {
  position: "absolute",
  top: 770,
  left: 100,
  width: 130,
  height: 130,
},

DesktopDevider: {
  position: "absolute",
  left: 270,
  top: 0,
  bottom: 0,
  width: 2,
  backgroundColor: "#27c93f",
  zIndex: 999,
}

});