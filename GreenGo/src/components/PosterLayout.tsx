import { View, Text, Image, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function PosterLayout() {
  return (
    <>
      {/* Logo */}

      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      />

      {/* Title */}

      <Text style={styles.titleWhite}>TASTE OF</Text>

      <Text style={styles.titleYellow}>GREENGO</Text>

      <Text style={styles.subtitle}>
        CAFE • LOUNGE • FINE DINING
      </Text>

      {/* Yellow curve */}

      <Svg style={styles.curve}>
        <Path
          d="
            M 120 0
            C 20 220, 150 450, 90 650
            C 30 850, 150 1050, 90 1350
          "
          stroke="#f5b000"
          strokeWidth="4"
          fill="none"
        />
      </Svg>

      {/* Pizza images */}

      <Image
        source={require("../../assets/images/pizza-1.png")}
        style={styles.pizzaTop}
      />

      <Image
        source={require("../../assets/images/pizza-2.png")}
        style={styles.pizzaMiddle}
      />

      <Image
        source={require("../../assets/images/pizza-3.png")}
        style={styles.pizzaBottom}
      />

      {/* Leaves */}

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

      {/* Badges */}

      <View style={styles.badgeTop}>
        <Text style={styles.badgeText}>
          FRESH{"\n"}COOKED
        </Text>
      </View>

      <View style={styles.badgeBottom}>
        <Text style={styles.badgeText}>
          100%{"\n"}QUALITY
        </Text>
      </View>

      {/* Footer */}

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>
          ORDER NOW
        </Text>

        <Text style={styles.footerPhone}>
          +251 912 345 678
        </Text>

        <Text style={styles.footerDelivery}>
          FAST DELIVERY
        </Text>

        <Text style={styles.footerBrand}>
          GreenGo
        </Text>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  logo: {
    position: "absolute",
    top: 30,
    left: 30,
    width: 85,
    height: 85,
    resizeMode: "contain",
  },

  titleWhite: {
    position: "absolute",
    top: 140,
    left: 30,
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },

  titleYellow: {
    position: "absolute",
    top: 195,
    left: 30,
    color: "#f5b000",
    fontSize: 56,
    fontWeight: "bold",
  },

  subtitle: {
    position: "absolute",
    top: 275,
    left: 30,
    color: "#ddd",
    letterSpacing: 4,
    fontSize: 12,
  },

  curve: {
    position: "absolute",
    right: 25,
    top: -20,
    width: 170,
    height: 1550,
  },

  pizzaTop: {
    position: "absolute",
    top: 90,
    right: -110,
    width: 320,
    height: 320,
    resizeMode: "contain",
  },

  pizzaMiddle: {
    position: "absolute",
    top: 500,
    right: -80,
    width: 260,
    height: 260,
    resizeMode: "contain",
  },

  pizzaBottom: {
    position: "absolute",
    top: 920,
    right: -110,
    width: 320,
    height: 320,
    resizeMode: "contain",
  },
leaf1: {
    position: "absolute",
    top: 320,
    right: 170,
    width: 55,
    height: 55,
  },

  leaf2: {
    position: "absolute",
    top: 780,
    right: 150,
    width: 60,
    height: 60,
  },

  leaf3: {
    position: "absolute",
    bottom: 130,
    right: 170,
    width: 60,
    height: 60,
  },

  badgeTop: {
    position: "absolute",
    top: 470,
    right: 150,
    width: 85,
    height: 85,
    borderRadius: 50,
    backgroundColor: "#f5b000",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeBottom: {
    position: "absolute",
    top: 1160,
    right: 150,
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#f5b000",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },

  footer: {
    position: "absolute",
    bottom: 40,
    left: 30,
  },

  footerTitle: {
    color: "#f5b000",
    fontSize: 26,
    fontWeight: "bold",
  },

  footerPhone: {
    color: "white",
    fontSize: 18,
  },

  footerDelivery: {
    color: "#f5b000",
    marginTop: 25,
    fontSize: 24,
    fontWeight: "bold",
  },

  footerBrand: {
    color: "white",
    fontSize: 18,
  },
});