import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import { useEffect, useState } from "react";
import { router } from "expo-router";

import { supabase } from "../../lib/supabase";

export default function OffersPage() {
  const { width } = useWindowDimensions();

  /*
   * RESPONSIVE BREAKPOINT
   *
   * Browser width >= 768:
   *     2 columns
   *
   * Browser width < 768:
   *     1 column
   */

  const isDesktop = width >= 768;

  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("active", true)
      .order("id", { ascending: false });

    console.log("OFFERS DATA:", data);
    console.log("OFFERS ERROR:", error);

    if (error) {
      setLoading(false);
      return;
    }

    setOffers(data || []);
    setLoading(false);
  };

  const getOfferType = (type: string) => {
    switch (type) {
      case "happy_hour":
        return {
          icon: "🔥",
          label: "HAPPY HOUR",
        };

      case "discount":
        return {
          icon: "🏷️",
          label: "DISCOUNT",
        };

      case "promotion":
        return {
          icon: "🎉",
          label: "PROMOTION",
        };

      default:
        return {
          icon: "✨",
          label: "SPECIAL OFFER",
        };
    }
  };

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: isDesktop ? 55 : 20,
            paddingTop: isDesktop ? 35 : 18,
          },
        ]}
      >

        {/* BACK TO MENU */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.replace("/menu/pizza" as any)
          }
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.backArrow,
              {
                fontSize: isDesktop ? 25 : 23,
              },
            ]}
          >
            ←
          </Text>

          <Text
            style={[
              styles.backText,
              {
                fontSize: isDesktop ? 14 : 13,
              },
            ]}
          >
            MENU
          </Text>
        </TouchableOpacity>

        {/* HEADER */}

        <View
          style={[
            styles.header,
            {
              marginBottom: isDesktop ? 38 : 28,
            },
          ]}
        >

          <Text style={styles.eyebrow}>
            GREENGO
          </Text>

          <Text
            style={[
              styles.title,
              {
                fontSize: isDesktop ? 48 : 36,
                lineHeight: isDesktop ? 55 : 42,
              },
            ]}
          >
            Special Offers
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                fontSize: isDesktop ? 17 : 15,
              },
            ]}
          >
            Something special is waiting for you.
          </Text>

        </View>

        {/* LOADING */}

        {loading ? (

          <Text style={styles.loading}>
            Loading offers...
          </Text>

        ) : offers.length === 0 ? (

          /* EMPTY */

          <View style={styles.empty}>

            <Text style={styles.emptyIcon}>
              ✨
            </Text>

            <Text style={styles.emptyTitle}>
              No offers right now
            </Text>

            <Text style={styles.emptyText}>
              Check back later for something special.
            </Text>

          </View>

        ) : (

          <View
            style={[
              styles.offerGrid,
              {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: isDesktop
                  ? "space-between"
                  : "flex-start",
              },
            ]}
          >

            {offers.map((offer) => {

              const offerType =
                getOfferType(offer.type);

              return (

                <TouchableOpacity
                  key={offer.id}
                  activeOpacity={0.9}

                  style={[
                    styles.offerCard,
                    {
                      width: isDesktop
                        ? "48%"
                        : "100%",

                      marginBottom: isDesktop
                        ? 24
                        : 18,
                    },
                  ]}

                  onPress={() =>
                    router.push(
                      `/menu/offer/${offer.id}` as any
                    )
                  }
                >

                  {/* IMAGE */}

                  <View
                    style={[
                      styles.imageContainer,
                      {
                        height: isDesktop
                          ? 270
                          : 180,
                      },
                    ]}
                  >

                    {offer.image_url ? (

                      <Image
                        source={{
                          uri: offer.image_url,
                        }}

                        style={styles.offerImage}

                        resizeMode="contain"
                      />

                    ) : (

                      <View
                        style={
                          styles.imagePlaceholder
                        }
                      >

                        <Text
                          style={[
                            styles.placeholderIcon,
                            {
                              fontSize:
                                isDesktop
                                  ? 70
                                  : 60,
                            },
                          ]}
                        >
                          {offerType.icon}
                        </Text>

                      </View>

                    )}

                  </View>

                  {/* CONTENT */}

                  <View
                    style={[
                      styles.cardContent,
                      {
                        padding:
                          isDesktop
                            ? 23
                            : 16,
                      },
                    ]}
                  >

                    {/* TYPE */}

                    <View
                      style={[
                        styles.typeRow,
                        {
                          marginBottom:
                            isDesktop
                              ? 10
                              : 7,
                        },
                      ]}
                    >
<Text
                        style={[
                          styles.typeIcon,
                          {
                            fontSize:
                              isDesktop
                                ? 27
                                : 20,
                          },
                        ]}
                      >
                        {offerType.icon}
                      </Text>

                      <Text
                        style={[
                          styles.typeText,
                          {
                            fontSize:
                              isDesktop
                                ? 16
                                : 12,

                            letterSpacing:
                              isDesktop
                                ? 1.8
                                : 1,
                          },
                        ]}
                      >
                        {offerType.label}
                      </Text>

                    </View>

                    {/* TITLE */}

                    <Text
                      style={[
                        styles.offerTitle,
                        {
                          fontSize:
                            isDesktop
                              ? 25
                              : 20,

                          lineHeight:
                            isDesktop
                              ? 31
                              : 25,
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {offer.title}
                    </Text>

                    {/* DESCRIPTION */}

                    {offer.description_en ? (

                      <Text
                        style={[
                          styles.description,
                          {
                            fontSize:
                              isDesktop
                                ? 15
                                : 14,

                            lineHeight:
                              isDesktop
                                ? 22
                                : 21,
                          },
                        ]}
                        numberOfLines={3}
                      >
                        {offer.description_en}
                      </Text>

                    ) : (

                      <Text
                        style={styles.noDescription}
                        numberOfLines={2}
                      >
                        Discover this special GreenGo
                        offer.
                      </Text>

                    )}

                    {/* VIEW OFFER */}

                    <View
                      style={[
                        styles.viewRow,
                        {
                          marginTop: 16,
                        },
                      ]}
                    >

                      <Text style={styles.viewOffer}>
                        VIEW OFFER
                      </Text>

                      <Text style={styles.arrow}>
                        →
                      </Text>

                    </View>

                  </View>

                </TouchableOpacity>
              );
            })}

          </View>
        )}

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#030303",
  },

  content: {
    paddingBottom: 60,
  },

  /*
   * BACK
   */

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",

    marginBottom: 18,

    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  backArrow: {
    color: "#f4b400",
    fontWeight: "900",
    marginRight: 7,
  },

  backText: {
    color: "#f4b400",
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  /*
   * HEADER
   */

  header: {
    width: "100%",
  },
eyebrow: {
    color: "#f4b400",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 8,
  },

  title: {
    color: "#fff",
    fontWeight: "900",
  },

  subtitle: {
    color: "#777",
    marginTop: 8,
  },

  /*
   * GRID
   */

  offerGrid: {
    width: "100%",
  },

  /*
   * CARD
   */

  offerCard: {
    backgroundColor: "#111",

    borderRadius: 18,

    overflow: "hidden",

    borderWidth: 1,

    borderColor: "#202020",
  },

  /*
   * IMAGE
   */

  imageContainer: {
    width: "100%",

    backgroundColor: "#0b0b0b",

    justifyContent: "center",

    alignItems: "center",

    overflow: "hidden",
  },

  offerImage: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    width: "100%",
    height: "100%",

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#151515",
  },

  placeholderIcon: {
    fontSize: 60,
  },

  /*
   * CARD CONTENT
   */

  cardContent: {},

  /*
   * TYPE
   */

  typeRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  typeIcon: {
    marginRight: 8,
  },

  typeText: {
    color: "#f4b400",
    fontWeight: "900",
  },

  /*
   * TITLE
   */

  offerTitle: {
    color: "#fff",
    fontWeight: "900",
  },

  /*
   * DESCRIPTION
   */

  description: {
    color: "#999",
    marginTop: 9,
  },

  noDescription: {
    color: "#555",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 9,
  },

  /*
   * VIEW
   */

  viewRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  viewOffer: {
    color: "#f4b400",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  arrow: {
    color: "#f4b400",
    fontSize: 21,
    fontWeight: "900",
    marginLeft: 8,
  },

  /*
   * STATES
   */

  loading: {
    color: "#888",
    textAlign: "center",
    marginTop: 60,
  },

  empty: {
    alignItems: "center",
    paddingVertical: 80,
  },

  emptyIcon: {
    fontSize: 55,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 15,
  },

  emptyText: {
    color: "#777",
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },

});