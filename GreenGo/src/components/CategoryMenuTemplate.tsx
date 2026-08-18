import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import {useFocusEffect} from "expo-router";
import Sidebar from "./Sidebar";

const { width, height } = Dimensions.get("window");

const isMobile = width < 768;
const isDesktop = width >= 1200;
const isLargeScreen = width >= 768;

type MenuItem = {
  id: number | string;
  name: string;
  price: number | string;
  section?: string | null;
};

type CategoryMenuTemplateProps = {
  categoryName: string;
  items: MenuItem[];

  // Used only by newly-created categories
  images?: string[];

  // Used only by Pizza
  pizzaImages?: any[];
};

export default function CategoryMenuTemplate({
  categoryName,
  items,
  images = [],
  pizzaImages = [],
}: CategoryMenuTemplateProps) {
  const [sidebarVisible, setSidebarVisible] =
    React.useState(false);
  const [sidebarKey, setSidebarKey] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setSidebarKey((value) => value + 1);
    }, [])
  );

  const isPizza =
    categoryName.toLowerCase() === "pizza";

  /*
   * Pizza uses its original local images.
   *
   * New categories use the images uploaded
   * through the Create Category page.
   */
  const menuImages = isPizza
    ? pizzaImages
    : images;

  return (
    <View style={styles.screen}>

      {/* =====================================================
          FIXED SIDEBAR
          ===================================================== */}

      {isMobile ? (
        <>
          <TouchableOpacity
            style={styles.settings}
            onPress={() =>
              setSidebarVisible(!sidebarVisible)
            }
          >
            <Ionicons
              name="menu"
              size={32}
              color="#fff"
            />
          </TouchableOpacity>

          <Sidebar
  key={sidebarKey}
  visible={
    isLargeScreen
      ? true
      : sidebarVisible
  }
  onClose={() => setSidebarVisible(false)}
/>
        </>
      ) : (
        <View style={styles.desktopSidebar}>
          <Sidebar
            visible={true}
            onClose={() => {}}
          />
        </View>
      )}

      {/* =====================================================
          MAIN SCROLLABLE AREA
          ===================================================== */}

      <View
        style={[
          styles.mainArea,
          isLargeScreen &&
            styles.mainAreaDesktop,
        ]}
      >

        <ScrollView
          style={styles.menuScroll}
          contentContainerStyle={
            styles.menuScrollContent
          }
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >

          <View style={styles.content}>

            {/* DESKTOP DIVIDER */}

            {isLargeScreen && (
              <View
                style={styles.DesktopDevider}
              />
            )}

            {/* =================================================
                LEFT SIDE
                ================================================= */}

            <View style={styles.leftSide}>

              {/* LOGO */}

              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
              />

              {/* TITLE */}

              <Text style={styles.titleWhite}>
                TASTE OF
              </Text>

              <Text style={styles.titleYellow}>
                GREENGO
              </Text>

              <Text style={styles.subtitle}>
                CAFE • LOUNGE • FINE DINING
              </Text>

              {/* CATEGORY NAME */}

              <Text
                style={[
                  styles.menuTitle,
                  {
                    fontSize:
                      isLargeScreen
                        ? 25
                        : 28,
                  },
                ]}
              >
                {categoryName.toUpperCase()} MENU
              </Text>

              <View style={styles.underline} />
{/* =================================================
                  MENU ITEMS
                  ================================================= */}

              {items.map((item) => (
                <View
                  key={item.id}
                  style={styles.itemRow}
                >

                  <Text
                    style={styles.itemName}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>

                  <View
                    style={styles.dots}
                  />

                  <View
                    style={styles.priceBox}
                  >

                    <Text
                      style={styles.price}
                    >
                      {item.price}
                    </Text>

                    <Text
                      style={styles.etb}
                    >
                      ETB
                    </Text>

                  </View>

                </View>
              ))}

              {/* =================================================
                  FOOTER
                  ================================================= */}

              <View style={styles.footer}>

                <View
                  style={styles.footerRow}
                >

                  <View
                    style={styles.iconCircle}
                  >
                    <Ionicons
                      name="call"
                      size={24}
                      color="white"
                    />
                  </View>

                  <View>

                    <Text
                      style={
                        styles.footerTitle
                      }
                    >
                      ORDER NOW
                    </Text>

                    <Text
                      style={
                        styles.footerText
                      }
                    >
                      +251 912 345 678
                    </Text>

                  </View>

                </View>

                <View
                  style={styles.footerLine}
                />

                <View
                  style={styles.footerRow}
                >

                  <View
                    style={styles.iconCircle}
                  >
                    <Ionicons
                      name="bicycle"
                      size={24}
                      color="white"
                    />
                  </View>

                  <View>

                    <Text
                      style={
                        styles.footerTitle
                      }
                    >
                      FAST DELIVERY
                    </Text>

                    <Text
                      style={
                        styles.footerText
                      }
                    >
                      GreenGo
                    </Text>

                  </View>

                </View>

              </View>

            </View>

            {/* =================================================
                RIGHT SIDE
                ================================================= */}

            <View style={styles.rightSide}>

              {/* MOBILE WAVE */}

              {isMobile && (
                <Svg
                  style={styles.wave}
                  viewBox="0 0 120 1500"
                >
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

              {/* =================================================
                  DESKTOP DECORATIONS
                  ================================================= */}
{isLargeScreen && (
                <View>

                  <Image
                    source={require("../../assets/images/geen-glow.png")}
                    style={styles.glowTop}
                  />

                  <Image
                    source={require("../../assets/images/geen-glow.png")}
                    style={styles.glowBottom}
                  />

                  <Image
                    source={require("../../assets/images/tomato2.png")}
                    style={styles.tomato1}
                  />

                  <Image
                    source={require("../../assets/images/tomato1.png")}
                    style={styles.tomato2}
                  />

                  <Image
                    source={require("../../assets/images/chilli1.png")}
                    style={styles.olive1}
                  />

                  <Image
                    source={require("../../assets/images/olive.png")}
                    style={styles.olive2}
                  />

                  <Image
                    source={require("../../assets/images/cheese.png")}
                    style={styles.cheese1}
                  />

                  <Image
                    source={require("../../assets/images/strawberry.png")}
                    style={styles.cheese2}
                  />

                  <Image
                    source={require("../../assets/images/sparkle.png")}
                    style={styles.sparkle1}
                  />

                  <Image
                    source={require("../../assets/images/green2.png")}
                    style={styles.sparkle2}
                  />

                </View>
              )}

              {/* =================================================
                  CATEGORY IMAGES
                  ================================================= */}

              {menuImages[0] && (
                <Image
                  source={
                    isPizza
                      ? menuImages[0]
                      : {
                          uri: menuImages[0],
                        }
                  }
                  style={styles.pizzaTop}
                />
              )}

              {menuImages[1] && (
                <Image
                  source={
                    isPizza
                      ? menuImages[1]
                      : {
                          uri: menuImages[1],
                        }
                  }
                  style={styles.pizzaMiddle}
                />
              )}

              {menuImages[2] && (
                <Image
                  source={
                    isPizza
                      ? menuImages[2]
                      : {
                          uri: menuImages[2],
                        }
                  }
                  style={styles.pizzaBottom}
                />
              )}

              {/* =================================================
                  LEAVES
                  ================================================= */}

              <Image
                source={require("../../assets/images/leaf-1.png")}
                style={styles.leaf1}
              />

              <Image
                source={require("../../assets/images/leaf-2.png")}
                style={styles.leaf2}
              />

              <Image
                source={require("../../assets/images/leaf-3.png")}
                style={styles.leaf3}
              />

              {/* =================================================
                  BADGES
                  ================================================= */}

              <View
                style={[
                  styles.badge,
                  styles.badgeTop,
                ]}
              >
                <Text
                  style={styles.badgeText}
                >
                  FRESH{"\n"}COOKED
                </Text>
              </View>
<View
                style={[
                  styles.badge,
                  styles.badgeBottom,
                ]}
              >
                <Text
                  style={styles.badgeText}
                >
                  100%{"\n"}QUALITY
                </Text>
              </View>

            </View>

          </View>

        </ScrollView>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  /* =========================================================
     SCREEN
     ========================================================= */

  screen: {
    flex: 1,
    height,
    backgroundColor: "#030303",
    flexDirection: "row",
  },

  /* =========================================================
     SIDEBAR
     ========================================================= */

  desktopSidebar: {
    width: 270,
    height: "100%",
    zIndex: 1000,
  },

  /* =========================================================
     MAIN AREA
     ========================================================= */

  mainArea: {
    flex: 1,
    height: "100%",
    backgroundColor: "#030303",
  },

  mainAreaDesktop: {
    height: "100%",
  },

  menuScroll: {
    flex: 1,
    height: "100%",
  },

  menuScrollContent: {
    flexGrow: 1,
    paddingBottom: 60,
  },

  /* =========================================================
     CONTENT
     ========================================================= */

  content: {
    flexDirection: "row",
    minHeight: height,
  },

  /* =========================================================
     LEFT SIDE
     ========================================================= */

  leftSide: {
    width: isDesktop
      ? "52%"
      : "58%",

    paddingTop: isDesktop
      ? 40
      : 20,

    paddingLeft: isDesktop
      ? 80
      : 20,

    paddingRight: 8,
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
    height: 55,
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
    color: "#f4b400",
    fontSize: 32,
    fontWeight: "900",
    fontFamily: "verdana",
  },

  underline: {
    width: isLargeScreen
      ? 160
      : 170,

    height: 4,

    backgroundColor: "#f4b400",

    marginTop: 8,

    marginBottom: 35,
  },

  /* =========================================================
     MENU ITEMS
     ========================================================= */

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    minHeight: 25,
  },

  itemName: {
    color: "white",
    fontWeight: "900",
    fontSize: 15,
    width: "55%",
    fontFamily: "verdana",
  },

  dots: {
    flex: 1,
    borderBottomWidth: 2,
    borderColor: "#ffaa00",
    borderStyle: "dotted",
    marginHorizontal: 5,
  },

  priceBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    width: 70,
    justifyContent: "flex-end",
  },

  price: {
    color: "#f4b400",
    fontSize: 18,
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

  /* =========================================================
     RIGHT SIDE
     ========================================================= */

  rightSide: {
    width: isDesktop
      ? "48%"
      : "42%",

    minHeight: height,

    position: "relative",

    overflow: "hidden",
  },

  /* =========================================================
     MOBILE WAVE
     ========================================================= */

  wave: {
    position: "absolute",
    left: -20,
    top: -30,
    width: 140,
    height: 1500,
  },
/* =========================================================
     CATEGORY IMAGES
     ========================================================= */

  pizzaTop: {
    position: "absolute",

    top: isDesktop
      ? 20
      : 50,

    right: isDesktop
      ? 70
      : -80,

    width: isDesktop
      ? 420
      : 330,

    height: isDesktop
      ? 420
      : 330,

    resizeMode: "contain",
  },

  pizzaMiddle: {
    position: "absolute",

    top: isDesktop
      ? 450
      : 420,

    right: isDesktop
      ? 70
      : -50,

    width: isDesktop
      ? 320
      : 240,

    height: isDesktop
      ? 320
      : 240,

    resizeMode: "contain",
  },

  pizzaBottom: {
    position: "absolute",

    top: isDesktop
      ? 800
      : 700,

    right: isDesktop
      ? 100
      : -40,

    width: isDesktop
      ? 250
      : 220,

    height: isDesktop
      ? 250
      : 220,

    resizeMode: "contain",
  },

  /* =========================================================
     LEAVES
     ========================================================= */

  leaf1: {
    position: "absolute",

    top: isLargeScreen
      ? 430
      : 5,

    left: isLargeScreen
      ? 180
      : 52,

    width: isLargeScreen
      ? 120
      : 70,

    height: isLargeScreen
      ? 120
      : 70,

    resizeMode: "contain",
  },

  leaf2: {
    position: "absolute",

    top: 1015,

    left: isLargeScreen
      ? 70
      : 45,

    width: isLargeScreen
      ? 130
      : 80,

    height: isLargeScreen
      ? 130
      : 80,

    resizeMode: "contain",
  },

  leaf3: {
    position: "absolute",

    top: isLargeScreen
      ? 700
      : undefined,

    bottom: isLargeScreen
      ? 130
      : 350,

    left: isLargeScreen
      ? 570
      : 5,

    width: isLargeScreen
      ? 110
      : 60,

    height: isLargeScreen
      ? 110
      : 60,

    resizeMode: "contain",
  },

  /* =========================================================
     BADGES
     ========================================================= */

  badge: {
    position: "absolute",
    width: 63,
    height: 63,
    borderRadius: 90,
    backgroundColor: "#ffc400",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
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

  /* =========================================================
     FOOTER
     ========================================================= */

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

  /* =========================================================
     MOBILE MENU BUTTON
     ========================================================= */

  settings: {
    position: "absolute",
    top: 10,
    left: 5,

    width: 60,
    height: 60,

    borderRadius: 30,

    backgroundColor: "#1a1a1a",

    justifyContent: "center",
    alignItems: "center",

    zIndex: 2000,
  },

  /* =========================================================
     DESKTOP DIVIDER
     ========================================================= */

  DesktopDevider: {
    position: "absolute",

    left: 0,
    top: 0,
    bottom: 0,

    width: 2,

    backgroundColor: "#27c93f",

    zIndex: 999,
  },

  /* =========================================================
     DESKTOP DECORATIONS
     ========================================================= */
glowTop: {
    position: "absolute",
    top: 750,
    right: 90,
    width: 400,
    height: 400,
    opacity: 0.45,
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
    top: 760,
    right: 370,
    width: 65,
    height: 65,
  },

  sparkle1: {
    position: "absolute",
    top: 120,
    left: 250,
    width: 350,
    height: 250,
    opacity: 0.4,
  },

  sparkle2: {
    position: "absolute",
    top: 770,
    left: 100,
    width: 130,
    height: 130,
  },
});