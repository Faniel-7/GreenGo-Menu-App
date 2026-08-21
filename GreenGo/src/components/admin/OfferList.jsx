import {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from "react-native";

import { useRouter } from "expo-router";

import AdminLayout from "./AdminLayout";
import AuthGuard from "./AuthGuard";

import { formatOfferDate } from "../../utils/dateFormatter";
import { supabase } from "../../lib/supabase";


export default function OffersList({
  title,
  icon,
  type,
}) {

  const router = useRouter();

  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // The offer currently waiting for delete confirmation
  const [deleteId, setDeleteId] = useState(null);

  // Prevent multiple delete requests
  const [deleting, setDeleting] = useState(false);


  useEffect(() => {
    loadOffers();
  }, []);


  async function loadOffers() {

    try {

      setLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("offers")
        .select("*")
        .eq("type", type)
        .order("created_at", {
          ascending: false,
        });


      if (error) {
        throw error;
      }


      setOffers(data || []);

    }

    catch (error) {

      console.log(
        "LOAD OFFERS ERROR:",
        error
      );

      Alert.alert(
        "Error",
        "Failed to load offers"
      );

    }

    finally {

      setLoading(false);

    }

  }


  /*
   * DELETE OFFER
   */

  async function deleteOffer(id) {

    if (deleting) {
      return;
    }

    try {

      setDeleting(true);

      console.log(
        "Deleting offer:",
        id
      );


      /*
       * STEP 1
       *
       * Delete items connected
       * to this offer.
       */

      const {
        error: offerItemsError,
      } = await supabase
        .from("offer_items")
        .delete()
        .eq("offer_id", id);


      if (offerItemsError) {

        console.log(
          "OFFER ITEMS DELETE ERROR:",
          offerItemsError
        );

        throw offerItemsError;

      }


      console.log(
        "Offer items deleted"
      );


      /*
       * STEP 2
       *
       * Delete target groups connected
       * to this offer.
       */

      const {
        error: targetGroupsError,
      } = await supabase
        .from("offer_target_groups")
        .delete()
        .eq("offer_id", id);


      if (targetGroupsError) {

        console.log(
          "TARGET GROUP DELETE ERROR:",
          targetGroupsError
        );

        throw targetGroupsError;

      }


      console.log(
        "Offer target groups deleted"
      );


      /*
       * STEP 3
       *
       * Delete the actual offer.
       */

      const {
        error: offerError,
      } = await supabase
        .from("offers")
        .delete()
        .eq("id", id);


      if (offerError) {

        console.log(
          "OFFER DELETE ERROR:",
          offerError
        );

        throw offerError;

      }


      console.log(
        "Offer deleted successfully:",
        id
      );


      /*
       * STEP 4
       *
       * Remove the offer immediately
       * from the UI.
       */

      setOffers(
        currentOffers =>
          currentOffers.filter(
            offer =>
              offer.id !== id
          )
      );


      /*
       * Close the confirmation area.
       */

      setDeleteId(null);


      Alert.alert(
        "Success",
        "Offer deleted successfully."
      );

    }

    catch (error) {

      console.log(
        "DELETE OFFER ERROR:",
        error
      );

      Alert.alert(
        "Delete Error",
        error?.message ||
        "Failed to delete offer."
      );

    }

    finally {

      setDeleting(false);

    }

  }


  /*
   * SHOW DELETE CONFIRMATION
   */

  function askDelete(id) {
console.log(
      "Delete button pressed:",
      id
    );

    setDeleteId(id);

  }


  /*
   * TOGGLE ACTIVE
   */

  async function toggleActive(offer) {

    try {

      const {
        error,
      } = await supabase
        .from("offers")
        .update({
          active: !offer.active,
        })
        .eq(
          "id",
          offer.id
        );


      if (error) {
        throw error;
      }


      /*
       * Update the current UI immediately.
       */

      setOffers(
        currentOffers =>
          currentOffers.map(
            currentOffer =>
              currentOffer.id === offer.id
                ? {
                    ...currentOffer,
                    active: !currentOffer.active,
                  }
                : currentOffer
          )
      );

    }

    catch (error) {

      console.log(
        "TOGGLE OFFER ERROR:",
        error
      );

      Alert.alert(
        "Error",
        error?.message ||
        "Failed to update offer."
      );

    }

  }


  return (

    <AuthGuard>

      <AdminLayout>

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >

          {/* HEADER */}

          <View style={styles.header}>

            <View>

              <Text style={styles.title}>
                {icon} {title}
              </Text>

              <Text style={styles.subtitle}>
                Manage your {title.toLowerCase()}
              </Text>

            </View>


            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadOffers}
            >

              <Text style={styles.refreshText}>
                Refresh
              </Text>

            </TouchableOpacity>

          </View>


          {/* LOADING */}

          {
            loading ? (

              <Text style={styles.loading}>
                Loading...
              </Text>

            ) : offers.length === 0 ? (

              /* EMPTY */

              <View style={styles.emptyBox}>

                <Text style={styles.emptyEmoji}>
                  📭
                </Text>

                <Text style={styles.emptyTitle}>
                  No {title}
                </Text>

                <Text style={styles.emptySubtitle}>
                  Create your first {title.toLowerCase()}
                </Text>

              </View>

            ) : (

              /* OFFER GRID */

              <View
                style={[
                  styles.grid,
                  isDesktop && styles.desktopGrid,
                ]}
              >

                {
                  offers.map(
                    offer => {

                      const isDeleting =
                        deleteId === offer.id;

                      return (

                        <View
                          key={offer.id}
                          style={[
                            styles.offerCard,

                            {
                              width:
                                isDesktop
                                  ? "48%"
                                  : "100%",
                            },
                          ]}
                        >

                          {/* IMAGE */}

                          {
                            offer.image_url && (

                              <View
                                style={
                                  styles.offerImageWrapper
                                }
                              >

                                <Image
                                  source={{
                                    uri:
                                      offer.image_url,
                                  }}
style={[
                                    styles.offerImage,
                                    {
                                      height:
                                        isDesktop
                                          ? 220
                                          : 180,
                                    },
                                  ]}
                                />

                              </View>

                            )
                          }


                          {/* CONTENT */}

                          <View
                            style={
                              styles.offerContent
                            }
                          >

                            {/* TITLE + STATUS */}

                            <View
                              style={
                                styles.offerHeader
                              }
                            >

                              <Text
                                style={
                                  styles.offerTitle
                                }
                                numberOfLines={2}
                              >

                                {
                                  offer.title ||
                                  "Untitled Offer"
                                }

                              </Text>


                              <View
                                style={[
                                  styles.badge,

                                  offer.active
                                    ? styles.activeBadge
                                    : styles.hiddenBadge,
                                ]}
                              >

                                <Text
                                  style={
                                    styles.badgeText
                                  }
                                >

                                  {
                                    offer.active
                                      ? "ACTIVE"
                                      : "HIDDEN"
                                  }

                                </Text>

                              </View>

                            </View>


                            {/* TYPE */}

                            <Text
                              style={
                                styles.typeText
                              }
                            >

                              {
                                offer.type
                                  ? offer.type
                                      .replace(
                                        /_/g,
                                        " "
                                      )
                                      .toUpperCase()
                                  : "SPECIAL OFFER"
                              }

                            </Text>


                            {/* DESCRIPTION */}

                            <Text
                              style={
                                styles.description
                              }
                              numberOfLines={3}
                              ellipsizeMode="tail"
                            >

                              {
                                offer.description_en ||
                                "No description"
                              }

                            </Text>


                            {/* DISCOUNT */}

                            {
                              offer.discount_percentage !==
                                null &&
                              offer.discount_percentage !==
                                undefined &&
                              offer.discount_percentage !==
                                "" && (
<Text
                                  style={
                                    styles.discount
                                  }
                                >

                                  🔥{" "}
                                  {
                                    offer.discount_percentage
                                  }% OFF

                                </Text>

                              )
                            }


                            {/* DATE */}

                            {
                              offer.start_date && (

                                <Text
                                  style={
                                    styles.info
                                  }
                                >

                                  📅{" "}

                                  {
                                    formatOfferDate(
                                      offer.start_date
                                    )
                                  }

                                  {
                                    offer.end_date
                                      ? ` - ${formatOfferDate(
                                          offer.end_date
                                            )}`
                                      : ""
                                  }

                                </Text>

                              )
                            }


                            {/* TIME */}

                            {
                              offer.start_time && (

                                <Text
                                  style={
                                    styles.info
                                  }
                                >

                                  ⏰{" "}
                                  {offer.start_time}

                                  {
                                    offer.end_time
                                        ? ` - ${offer.end_time}`
                                      : ""
                                  }

                                </Text>

                              )
                            }


                            {/* ACTIONS */}

                            <View
                              style={
                                styles.actions
                              }
                            >

                              {/* EDIT */}

                              <TouchableOpacity
                                style={
                                  styles.editButton
                                }
                                  onPress={() =>
                                  router.push(
                                    `/admin/offers/${offer.id}`
                                  )
                                }
                              >

                                <Text
                                  style={
                                    styles.buttonText
                                  }
                                >
                                  ✏️ Edit
                                </Text>

                              </TouchableOpacity>


                              {/* HIDE / SHOW */}

                              <TouchableOpacity
                                style={
                                  styles.hideButton
                                }
                                onPress={() =>
                                  toggleActive(
                                    offer
                                  )
                                }
                              >

                                <Text
                                  style={
                                    styles.buttonText
                                  }
                                >

                                  👁{" "}
{
                                    offer.active
                                      ? "Hide"
                                      : "Show"
                                  }

                                </Text>

                              </TouchableOpacity>


                              {/* DELETE */}

                              <TouchableOpacity
                                style={[
                                  styles.deleteButton,
                                  isDeleting &&
                                    styles.deleteButtonSelected,
                                ]}
                                onPress={() =>
                                  askDelete(
                                    offer.id
                                  )
                                }
                                disabled={deleting}
                              >

                                <Text
                                  style={
                                    styles.buttonText
                                  }
                                >
                                  🗑 Delete
                                </Text>

                              </TouchableOpacity>

                            </View>


                            {/* 
                             * DELETE CONFIRMATION
                             *
                             * IMPORTANT:
                             * This is INSIDE the card.
                             *
                             * Therefore it appears directly
                             * under the Delete button that
                             * was pressed.
                             */}

                            {
                              isDeleting && (

                                <View
                                  style={
                                    styles.deleteConfirmBox
                                  }
                                >

                                  <Text
                                    style={
                                      styles.deleteConfirmTitle
                                    }
                                  >
                                    Delete Offer?
                                  </Text>


                                  <Text
                                    style={
                                      styles.deleteConfirmMessage
                                    }
                                  >
                                    Are you sure you want to
                                    permanently delete this offer?
                                  </Text>


                                  <View
                                    style={
                                      styles.deleteConfirmActions
                                    }
                                  >

                                    {/* CANCEL */}

                                    <TouchableOpacity
                                      style={
                                        styles.cancelDeleteButton
                                      }
                                      onPress={() =>
                                        setDeleteId(
                                          null
                                        )
                                      }
                                      disabled={
                                        deleting
                                      }
                                    >

                                      <Text
                                        style={
                                          styles.cancelDeleteText
                                        }
                                      >
                                        Cancel
                                      </Text>

                                    </TouchableOpacity>
{/* CONFIRM */}

                                    <TouchableOpacity
                                      style={
                                        styles.confirmDeleteButton
                                      }
                                      onPress={() =>
                                        deleteOffer(
                                          offer.id
                                        )
                                      }
                                      disabled={
                                        deleting
                                      }
                                    >

                                      <Text
                                        style={
                                          styles.confirmDeleteText
                                        }
                                      >

                                        {
                                          deleting
                                            ? "Deleting..."
                                            : "Delete"
                                        }

                                      </Text>

                                    </TouchableOpacity>

                                  </View>

                                </View>

                              )
                            }

                          </View>

                        </View>

                      );

                    }
                  )
                }

              </View>

            )
          }

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


  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },


  title: {
    color: "#f4b400",
    fontSize: 34,
    fontWeight: "900",
  },


  subtitle: {
    color: "#999",
    marginTop: 6,
    fontSize: 15,
  },


  refreshButton: {
    backgroundColor: "#f4b400",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },


  refreshText: {
    color: "#000",
    fontWeight: "900",
  },


  loading: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },


  emptyBox: {
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    marginTop: 30,
  },


  emptyEmoji: {
    fontSize: 50,
  },


  emptyTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 15,
  },


  emptySubtitle: {
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },


  /*
   * DESKTOP:
   * 2 columns
   *
   * PHONE:
   * 1 column
   */

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },


  desktopGrid: {
    gap: 20,
  },


  offerCard: {
    backgroundColor: "#111",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#222",

    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },


  /*
   * IMAGE
   */

  offerImageWrapper: {
    width: "100%",
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },


  offerImage: {
    width: "100%",
    backgroundColor: "#111",
    resizeMode: "contain",
  },


  /*
   * CONTENT
   */

  offerContent: {
    padding: 18,
  },


  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },


  offerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    flex: 1,
    marginRight: 10,
  },


  /*
   * STATUS
   */

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },


  activeBadge: {
    backgroundColor: "#1ecb00",
  },


  hiddenBadge: {
    backgroundColor: "#555",
  },
badgeText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "900",
  },


  /*
   * TYPE
   */

  typeText: {
    color: "#f4b400",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 12,
    textTransform: "uppercase",
  },


  /*
   * DESCRIPTION
   */

  description: {
    color: "#bbb",
    marginTop: 12,
    lineHeight: 21,
    fontSize: 15,
    minHeight: 63,
  },


  /*
   * DISCOUNT
   */

  discount: {
    color: "#1ecb00",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 15,
  },


  /*
   * DATE / TIME
   */

  info: {
    color: "#aaa",
    marginTop: 10,
    fontSize: 14,
  },


  /*
   * ACTION BUTTONS
   */

  actions: {
    flexDirection: "row",
    marginTop: 22,
    gap: 10,
  },


  editButton: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f4b400",
  },


  hideButton: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#444",
  },


  deleteButton: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#8b3a3a",
  },


  deleteButtonSelected: {
    backgroundColor: "#241010",
    borderColor: "#d64545",
  },


  buttonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 13,
  },


  /*
   * DELETE CONFIRMATION
   *
   * This is deliberately inside
   * the offer card instead of at
   * the bottom of ScrollView.
   */

  deleteConfirmBox: {
    marginTop: 15,
    padding: 16,
    backgroundColor: "#191010",
    borderWidth: 1,
    borderColor: "#6b2929",
    borderRadius: 14,
  },


  deleteConfirmTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
  },


  deleteConfirmMessage: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7,
  },


  deleteConfirmActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },


  cancelDeleteButton: {
    flex: 1,
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#444",
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
  },


  cancelDeleteText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 13,
  },


  confirmDeleteButton: {
    flex: 1,
    backgroundColor: "#d64545",
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
  },


  confirmDeleteText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 13,
  },

});