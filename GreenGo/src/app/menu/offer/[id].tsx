import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";

import { supabase } from "../../../lib/supabase";
import { formatLocalTime } from "../../../utils/timeFormattter";

const { width } = Dimensions.get("window");
const isDesktop = width >= 768;

export default function OfferDetails() {
  const { id } = useLocalSearchParams();

  const [offer, setOffer] = useState<any>(null);
  const [offerItems, setOfferItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOffer();
    }
  }, [id]);

  const loadOffer = async () => {
    try {
      setLoading(true);

      // 1. GET OFFER
      const { data: offerData, error: offerError } =
        await supabase
          .from("offers")
          .select("*")
          .eq("id", id)
          .single();

      if (offerError) {
        console.log("OFFER ERROR:", offerError);
        setLoading(false);
        return;
      }

      setOffer(offerData);

      // 2. GET OFFER ITEMS
      const { data: offerItemData, error: offerItemError } =
        await supabase
          .from("offer_items")
          .select("*")
          .eq("offer_id", id);

      if (offerItemError) {
        console.log(
          "OFFER ITEMS ERROR:",
          offerItemError
        );

        setOfferItems([]);
        setLoading(false);
        return;
      }

      // 3. GET ACTUAL MENU ITEMS
      if (offerItemData && offerItemData.length > 0) {
        const itemIds = offerItemData.map(
          (item: any) => item.item_id
        );

        const { data: menuData, error: menuError } =
          await supabase
            .from("category_items")
            .select("*")
            .in("id", itemIds);

        if (menuError) {
          console.log(
            "MENU ITEMS ERROR:",
            menuError
          );
        } else {
          const combinedItems = offerItemData.map(
            (offerItem: any) => {
              const menuItem = menuData?.find(
                (item: any) =>
                  item.id === offerItem.item_id
              );

              return {
                ...offerItem,
                menuItem,
              };
            }
          );

          setOfferItems(combinedItems);
        }
      } else {
        setOfferItems([]);
      }
    } catch (error) {
      console.log("LOAD OFFER ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOfferType = () => {
    switch (offer?.type) {
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

  const formatDate = (date: string | null) => {
    if (!date) return "";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateDiscountedPrice = (
    price: number,
    discount: any
  ) => {
    if (
      discount === null ||
      discount === undefined ||
      discount === ""
    ) {
      return null;
    }

    return price * (1 - Number(discount) / 100);
  };

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator
          size="large"
          color="#f4b400"
        />

        <Text style={styles.loadingText}>
          Loading offer...
        </Text>
      </View>
    );
  }

  if (!offer) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.notFound}>
          Offer not found
        </Text>
<TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ← BACK
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const offerType = getOfferType();

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* BACK */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ← MENU
          </Text>
        </TouchableOpacity>

        {/* HERO */}

        <View style={styles.heroContainer}>

          {offer.image_url ? (
            <Image
              source={{
                uri: offer.image_url,
              }}
              style={styles.heroImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.noImage}>
              <Text style={styles.noImageIcon}>
                {offerType.icon}
              </Text>
            </View>
          )}

        </View>

        {/* MAIN INFO */}

        <View style={styles.mainContent}>

          {/* LARGE TYPE */}

          <View style={styles.typeContainer}>

            <Text style={styles.typeIcon}>
              {offerType.icon}
            </Text>

            <Text style={styles.typeText}>
              {offerType.label}
            </Text>

          </View>

          {/* TITLE */}

          <Text style={styles.title}>
            {offer.title}
          </Text>

          {/* ENGLISH DESCRIPTION */}

          {offer.description_en ? (
            <Text style={styles.description}>
              {offer.description_en}
            </Text>
          ) : null}

          {/* LOCAL DESCRIPTION */}

          {offer.description_ti ? (
            <Text style={styles.localDescription}>
              {offer.description_ti}
            </Text>
          ) : null}

          {/* PROMOTION DETAILS */}

          {offer.promotion_details ? (
            <View style={styles.detailsBox}>

              <Text style={styles.detailsLabel}>
                ABOUT THIS OFFER
              </Text>

              <Text style={styles.detailsText}>
                {offer.promotion_details}
              </Text>

            </View>
          ) : null}

          {/* ITEMS */}

          {offerItems.length > 0 ? (
            <View style={styles.itemsSection}>

              <Text style={styles.sectionTitle}>
                SPECIAL MENU
              </Text>

              <Text style={styles.sectionSubtitle}>
                Items included in this offer
              </Text>

              <View style={styles.itemsList}>

                {offerItems.map(
                  (offerItem: any, index: number) => {

                    const item =
                      offerItem.menuItem;

                    if (!item) return null;

                    const discount =
                      offerItem.discount_percentage;

                    const finalPrice =
                      calculateDiscountedPrice(
                        Number(item.price),
                        discount
                      );

                    return (
                      <View
                        key={`${item.id}-${index}`}
                        style={styles.itemRow}
                      >

                        <View
                          style={styles.itemInfo}
                        >

                          <Text
                            style={styles.itemName}
                          >
                            {item.name}
                          </Text>

                          {discount !==
null &&
                          discount !==
                            undefined &&
                          discount !== "" ? (
                            <Text
                              style={styles.discount}
                            >
                              {Number(discount)}% OFF
                            </Text>
                          ) : null}

                        </View>

                        <View
                          style={styles.priceBox}
                        >

                          {finalPrice !==
                          null ? (
                            <>
                              <Text
                                style={
                                  styles.oldPrice
                                }
                              >
                                {Number(
                                  item.price
                                ).toLocaleString()}{" "}
                                ETB
                              </Text>

                              <Text
                                style={
                                  styles.newPrice
                                }
                              >
                                {Math.round(
                                  finalPrice
                                ).toLocaleString()}{" "}
                                ETB
                              </Text>
                            </>
                          ) : (
                            <Text
                              style={
                                styles.normalPrice
                              }
                            >
                              {Number(
                                item.price
                              ).toLocaleString()}{" "}
                              ETB
                            </Text>
                          )}

                        </View>

                      </View>
                    );
                  }
                )}

              </View>

            </View>
          ) : null}

          {/* DURATION */}

          {(
            offer.start_date ||
            offer.end_date ||
            offer.start_time ||
            offer.end_time
          ) ? (
            <View
              style={styles.durationSection}
            >

              <Text style={styles.sectionTitle}>
                OFFER DURATION
              </Text>

              {(
                offer.start_date ||
                offer.end_date
              ) ? (
                <View style={styles.infoRow}>

                  <Text style={styles.infoIcon}>
                    📅
                  </Text>

                  <Text style={styles.infoText}>
                    {offer.start_date &&
                    offer.end_date
                      ? `${formatDate(
                          offer.start_date
                        )} – ${formatDate(
                          offer.end_date
                        )}`
                      : offer.start_date
                      ? `From ${formatDate(
                          offer.start_date
                        )}`
                      : `Until ${formatDate(
                          offer.end_date
                        )}`}
                  </Text>

                </View>
              ) : null}

              {(
                offer.start_time ||
                offer.end_time
              ) ? (
                <View style={styles.infoRow}>

                  <Text style={styles.infoIcon}>
                    🕐
                  </Text>

                  <Text style={styles.infoText}>
                    {offer.start_time &&
offer.end_time
  ? `${formatLocalTime(
      offer.start_time
    )} LT – ${formatLocalTime(
      offer.end_time
    )} LT`
  : offer.start_time
  ? `From ${formatLocalTime(
      offer.start_time
    )} LT`
  : `Until ${formatLocalTime(
      offer.end_time
    )} LT`}
                  </Text>

                </View>
              ) : null}

            </View>
          ) : null}

        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030303",
  },

  scrollContent: {
    paddingBottom: 70,
  },

  backButton: {
    alignSelf: "flex-start",
    marginTop: 12,
    marginLeft: isDesktop ? 42 : 14,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },

  backText: {
    color: "#f4b400",
    fontSize: isDesktop ? 15 : 14,
    fontWeight: "900",
    letterSpacing: 1,
  },

  /*
   * HERO
   */

  heroContainer: {
    width: "100%",
    height: isDesktop ? 360 : 220,
    backgroundColor: "#0b0b0b",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  noImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },

  noImageIcon: {
    fontSize: isDesktop ? 90 : 65,
  },

  /*
   * MAIN CONTENT
   */

  mainContent: {
    width: "100%",
    maxWidth: isDesktop ? 1050 : 9999,
    alignSelf: "center",
    paddingHorizontal: isDesktop ? 50 : 20,
  },

  /*
   * OFFER TYPE
   */

  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: isDesktop ? 36 : 25,
    marginBottom: 12,
  },

  typeIcon: {
    fontSize: isDesktop ? 34 : 30,
    marginRight: 11,
  },

  typeText: {
    color: "#f4b400",
    fontSize: isDesktop ? 25 : 21,
    fontWeight: "900",
    letterSpacing: isDesktop ? 3 : 2,
  },

  /*
   * TITLE
   */

  title: {
    color: "#fff",
    fontSize: isDesktop ? 44 : 31,
    lineHeight: isDesktop ? 51 : 38,
    fontWeight: "900",
  },

  description: {
    color: "#bcbcbc",
    fontSize: isDesktop ? 17 : 15,
    lineHeight: isDesktop ? 27 : 23,
    marginTop: 14,
    maxWidth: 850,
  },

  localDescription: {
    color: "#777",
    fontSize: isDesktop ? 15 : 14,
    lineHeight: 22,
    marginTop: 9,
    fontStyle: "italic",
  },

  /*
   * OPTIONAL PROMOTION DETAILS
   */

  detailsBox: {
    marginTop: 24,
    backgroundColor: "#101010",
    borderLeftWidth: 3,
    borderLeftColor: "#f4b400",
    padding: isDesktop ? 22 : 18,
  },

  detailsLabel: {
    color: "#f4b400",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  detailsText: {
    color: "#ccc",
    fontSize: 15,
    lineHeight: 23,
  },

  /*
   * ITEMS
   */

  itemsSection: {
    marginTop: isDesktop ? 42 : 34,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: isDesktop ? 25 : 21,
    fontWeight: "900",
  },

  sectionSubtitle: {
    color: "#666",
    fontSize: 13,
    marginTop: 5,
    marginBottom: 16,
  },

  itemsList: {
    backgroundColor: "#101010",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1d1d1d",
  },

  itemRow: {
    minHeight: isDesktop ? 82 : 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: isDesktop ? 25 : 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#202020",
  },

  itemInfo: {
    flex: 1,
    paddingRight: 15,
  },

  itemName: {
    color: "#fff",
    fontSize: isDesktop ? 18 : 15,
    fontWeight: "800",
  },

  discount: {
    color: "#f4b400",
    fontSize: isDesktop ? 13 : 12,
    fontWeight: "900",
    marginTop: 6,
    letterSpacing: 0.5,
  },

  priceBox: {
    alignItems: "flex-end",
    minWidth: isDesktop ? 125 : 95,
  },

  oldPrice: {
    color: "#666",
    fontSize: 12,
    textDecorationLine: "line-through",
  },

  newPrice: {
    color: "#f4b400",
    fontSize: isDesktop ? 19 : 16,
    fontWeight: "900",
    marginTop: 3,
  },

  normalPrice: {
    color: "#fff",
    fontSize: isDesktop ? 17 : 15,
    fontWeight: "800",
  },

  /*
   * DATE / TIME
   */

  durationSection: {
    marginTop: 30,
    backgroundColor: "#101010",
    borderRadius: 16,
    padding: isDesktop ? 24 : 18,
    borderWidth: 1,
    borderColor: "#1d1d1d",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  infoText: {
    color: "#ccc",
    fontSize: isDesktop ? 15 : 14,
    flex: 1,
  },

  /*
   * STATES
   */

  loadingScreen: {
    flex: 1,
    backgroundColor: "#030303",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#888",
    marginTop: 12,
  },

  notFound: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 15,
  },
});