import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  Switch,
  Platform,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import OfferScheduleFields from "../../../components/admin/OfferScheduleFields";
import { useRouter, useLocalSearchParams } from "expo-router";
import AdminToast from "../../../components/admin/AdminToast";
import AdminLayout from "../../../components/admin/AdminLayout";
import AuthGuard from "../../../components/admin/AuthGuard";
import { supabase } from "../../../lib/supabase";

export default function CreateOffer() {
  function showMessage(title, message) {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  }

  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [offerType, setOfferType] = useState("happy_hour");
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionLocal, setDescriptionLocal] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [promotionDetails, setPromotionDetails] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [active, setActive] = useState(true);

  const [targetGroups, setTargetGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemDiscounts, setItemDiscounts] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  async function fetchTargetGroups() {
    const { data, error } = await supabase
      .from("target_groups")
      .select("*");

    if (error) {
      console.error("Failed to load target groups:", error);
      return;
    }

    setTargetGroups(data || []);
  }

  async function fetchMenuItems() {
    const { data, error } = await supabase
      .from("category_items")
      .select(`
        id,
        name,
        price,
        category_id,
        categories(name)
      `)
      .eq("active", true);

    if (error) {
      console.error("Failed to load menu items:", error);
      return;
    }

    setMenuItems(data || []);
  }

  async function loadOffer() {
    const offerId = Array.isArray(id) ? id[0] : id;

    if (!offerId) {
      showMessage("Error", "The offer ID is missing.");
      return;
    }

    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("id", offerId)
      .single();

    if (error) {
      console.error("Failed to load offer:", error);
      showMessage("Could not load offer", error.message);
      return;
    }

    setOfferType(data.type || "happy_hour");
    setTitle(data.title || "");
    setDescriptionEn(data.description_en || "");
    setDescriptionLocal(data.description_ti || "");

    setDiscountPercentage(
      data.discount_percentage != null
        ? String(data.discount_percentage)
        : ""
    );

    setPromotionDetails(data.promotion_details || "");
    setStartDate(data.start_date || "");
    setEndDate(data.end_date || "");
    setStartTime(data.start_time || "");
    setEndTime(data.end_time || "");
    setActive(data.active ?? true);

    const { data: groups, error: groupsError } = await supabase
      .from("offer_target_groups")
      .select("target_group_id")
      .eq("offer_id", offerId);

    if (groupsError) {
      console.error("Failed to load offer target groups:", groupsError);
    } else {
      setSelectedGroups(
        (groups || []).map((group) => group.target_group_id)
      );
    }

    const { data: items, error: itemsError } = await supabase
      .from("offer_items")
      .select("item_id, discount_percentage")
      .eq("offer_id", offerId);

    if (itemsError) {
      console.error("Failed to load offer items:", itemsError);
    } else {
      setSelectedItems((items || []).map((item) => item.item_id));

      const discounts = {};

      (items || []).forEach((item) => {
        discounts[item.item_id] =
          item.discount_percentage != null
            ? String(item.discount_percentage)
            : "";
      });

      setItemDiscounts(discounts);
    }

    if (data.image_url) {
      setImages([data.image_url]);
    }
  }

  async function pickImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setImages([result.assets[0].uri]);
      }
    } catch (error) {
      console.error("Image selection failed:", error);
      showMessage(
        "Image error",
        error?.message || "Could not select the image."
      );
    }
  }

  function toggleCategory(name) {
    setExpandedCategories((current) => ({
      ...current,
      [name]: !current[name],
    }));
  }

  function toggleGroup(groupId) {
    setSelectedGroups((current) =>
      current.includes(groupId)
        ? current.filter((item) => item !== groupId)
        : [...current, groupId]
    );
  }

  function toggleItem(itemId) {
    setSelectedItems((current) =>
      current.includes(itemId)
        ? current.filter((item) => item !== itemId)
        : [...current, itemId]
    );
  }

  async function uploadImage(uri) {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();
    const fileName = `offer-${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from("menu-images")
      .upload(`offers/${fileName}`, arrayBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("menu-images")
      .getPublicUrl(`offers/${fileName}`);

    return data.publicUrl;
  }

  async function updateOffer() {
    if (loading) return;

    const offerId = Array.isArray(id) ? id[0] : id;

    if (!offerId) {
      showMessage(
        "Save failed",
        "The offer ID is missing. Return to the offers page and open the offer again."
      );
      return;
    }

    if (!title.trim()) {
      showMessage("Missing title", "Please enter an offer title.");
      return;
    }

    const discount = discountPercentage.trim()
      ? Number(discountPercentage)
      : null;

    if (
      discount !== null &&
      (!Number.isFinite(discount) || discount < 0 || discount > 100)
    ) {
      showMessage(
        "Invalid discount",
        "Enter a discount between 0 and 100."
      );
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      showMessage(
        "Invalid schedule",
        "The end date must be on or after the start date."
      );
      return;
    }

    const invalidItemDiscount = selectedItems.some((itemId) => {
      const value = itemDiscounts[itemId];

      if (value === undefined || String(value).trim() === "") {
        return false;
      }

      const number = Number(value);
      return !Number.isFinite(number) || number < 0 || number > 100;
    });

    if (invalidItemDiscount) {
      showMessage(
        "Invalid item discount",
        "Each menu item discount must be between 0 and 100."
      );
      return;
    }

    const validTime = (value) =>
      !value || /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);

    if (!validTime(startTime) || !validTime(endTime)) {
      showMessage(
        "Invalid time",
        "Enter times in 24-hour HH:MM format."
      );
      return;
    }

    setLoading(true);

    try {
      let imageUrl = images[0] || null;

      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = await uploadImage(imageUrl);
      }

      // Do not send promotion_details because that column is not
      // available in the current offers table.
      const { data: updatedOffer, error: updateError } = await supabase
        .from("offers")
        .update({
          title: title.trim(),
          type: offerType,
          image_url: imageUrl,
          description_en: descriptionEn,
          description_ti: descriptionLocal,
          discount_percentage: discount,
          start_date: startDate || null,
          end_date: endDate || null,
          start_time: startTime.trim() || null,
          end_time: endTime.trim() || null,
          active,
        })
        .eq("id", offerId)
        .select("id")
        .maybeSingle();

      if (updateError) throw updateError;

      if (!updatedOffer) {
        throw new Error(
          "No offer was updated. Check that the offer still exists and your account has permission to edit it."
        );
      }

      const { error: deleteItemsError } = await supabase
        .from("offer_items")
        .delete()
        .eq("offer_id", offerId);

      if (deleteItemsError) throw deleteItemsError;

      if (selectedItems.length > 0) {
        const itemsInsert = selectedItems.map((itemId) => ({
          offer_id: offerId,
          item_id: itemId,
          discount_percentage:
            itemDiscounts[itemId] !== undefined &&
            String(itemDiscounts[itemId]).trim() !== ""
              ? Number(itemDiscounts[itemId])
              : null,
        }));

        const { error: itemsError } = await supabase
          .from("offer_items")
          .insert(itemsInsert);

        if (itemsError) throw itemsError;
      }

      const { error: deleteGroupsError } = await supabase
        .from("offer_target_groups")
        .delete()
        .eq("offer_id", offerId);

      if (deleteGroupsError) throw deleteGroupsError;

      if (selectedGroups.length > 0) {
        const groupsInsert = selectedGroups.map((groupId) => ({
          offer_id: offerId,
          target_group_id: groupId,
        }));

        const { error: groupsError } = await supabase
          .from("offer_target_groups")
          .insert(groupsInsert);

        if (groupsError) throw groupsError;
      }

      setToast("✓ Offer updated successfully");
      showMessage("Success", "Your offer has been updated successfully.");

      router.replace(`/admin/offers/${offerId}`);
    } catch (error) {
      console.error("Failed to update offer:", error);

      showMessage(
        "Could not save offer",
        error?.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function addTargetGroup() {
    const groupName = newGroupName.trim();

    if (!groupName) {
      showMessage("Missing name", "Please enter a target group name.");
      return;
    }

    if (
      targetGroups.some(
        (group) =>
          group.name?.trim().toLowerCase() === groupName.toLowerCase()
      )
    ) {
      showMessage(
        "Already exists",
        "A target group with this name already exists."
      );
      return;
    }

    try {
      const { data, error } = await supabase
        .from("target_groups")
        .insert({ name: groupName })
        .select("*")
        .single();

      if (error) throw error;

      if (!data?.id) {
        throw new Error(
          "The database did not return the new target group."
        );
      }

      setTargetGroups((current) => [...current, data]);

      setSelectedGroups((current) =>
        current.includes(data.id) ? current : [...current, data.id]
      );

      setNewGroupName("");
      setShowGroupModal(false);
      setToast(`✓ Target group "${data.name}" added successfully`);
    } catch (error) {
      console.error("Failed to create target group:", error);

      showMessage(
        "Target group error",
        error?.message || "Could not create the target group."
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
          <Text style={styles.title}>Edit Offer</Text>

          <Text style={styles.section}>Offer Type</Text>

          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[
                styles.typeCard,
                offerType === "happy_hour" && styles.selectedCard,
              ]}
              onPress={() => setOfferType("happy_hour")}
            >
              <Text style={styles.typeEmoji}>🔥</Text>
              <Text style={styles.typeTitle}>Happy Hour</Text>
              <Text style={styles.typeSubtitle}>Time Based</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeCard,
                offerType === "discount" && styles.selectedCard,
              ]}
              onPress={() => setOfferType("discount")}
            >
              <Text style={styles.typeEmoji}>🏷️</Text>
              <Text style={styles.typeTitle}>Discount</Text>
              <Text style={styles.typeSubtitle}>Price Reduction</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeCard,
                offerType === "promotion" && styles.selectedCard,
              ]}
              onPress={() => setOfferType("promotion")}
            >
              <Text style={styles.typeEmoji}>🎉</Text>
              <Text style={styles.typeTitle}>Promotion</Text>
              <Text style={styles.typeSubtitle}>Special Campaign</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Offer Title"
            placeholderTextColor="#777"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.section}>Offer Image</Text>

          <View style={styles.imageRow}>
            {images.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={styles.image}
              />
            ))}

            <TouchableOpacity
              style={styles.uploadBox}
              onPress={pickImage}
            >
              <Text style={styles.plus}>+</Text>
              <Text style={styles.uploadText}>Add Image</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.section}>Descriptions</Text>

          <TextInput
            style={styles.itemInput}
            placeholder="English"
            placeholderTextColor="#777"
            value={descriptionEn}
            onChangeText={setDescriptionEn}
            multiline
          />

          <TextInput
            style={styles.itemInput}
            placeholder="Tigrigna/Amharic"
            placeholderTextColor="#848484"
            value={descriptionLocal}
            onChangeText={setDescriptionLocal}
            multiline
          />

          <Text style={styles.section}>Target Groups</Text>

          <View style={styles.groupContainer}>
            {targetGroups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.groupChip,
                  selectedGroups.includes(group.id) && styles.selectedChip,
                ]}
                onPress={() => toggleGroup(group.id)}
              >
                <Text
                  style={[
                    styles.groupText,
                    selectedGroups.includes(group.id) &&
                      styles.selectedGroupText,
                  ]}
                >
                  {group.name}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => setShowGroupModal(true)}>
              <Text style={styles.addGroupText}>+ Add Target Group</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.section}>Menu Items</Text>

          <View style={styles.categoryGrid}>
            {[
              "Pizza",
              "Burger and Sandwich",
              "Hot Drinks",
              "Breakfast",
              "Salad and Soup",
              "Juice and Shakes",
              "Rice, Pasta and Wrap",
              "Chinese",
            ].map((category) => (
              <View key={category} style={styles.categoryCard}>
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(category)}
                >
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.arrow}>
                    {expandedCategories[category] ? "▼" : "▲"}
                  </Text>
                </TouchableOpacity>

                {expandedCategories[category] && (
                  <View>
                    {menuItems
                      .filter(
                        (item) => item.categories?.name === category
                      )
                      .map((item) => {
                        const selected = selectedItems.includes(item.id);

                        return (
                          <View key={item.id}>
                            <TouchableOpacity
                              style={styles.checkboxRow}
                              onPress={() => toggleItem(item.id)}
                            >
                              <Text style={styles.checkbox}>
                                {selected ? "☑️" : "☐"}
                              </Text>

                              <Text style={styles.checkboxText}>
                                {item.name}
                              </Text>
                            </TouchableOpacity>

                            {selected && (
                              <TextInput
                                style={styles.itemDiscountInput}
                                placeholder="Discount %"
                                placeholderTextColor="#777"
                                keyboardType="numeric"
                                value={itemDiscounts[item.id] || ""}
                                onChangeText={(text) =>
                                  setItemDiscounts((current) => ({
                                    ...current,
                                    [item.id]: text,
                                  }))
                                }
                              />
                            )}
                          </View>
                        );
                      })}
                  </View>
                )}
              </View>
            ))}
          </View>

          {offerType === "happy_hour" && (
            <TextInput
              style={styles.input}
              placeholder="Discount % (optional)"
              placeholderTextColor="#777"
              keyboardType="numeric"
              value={discountPercentage}
              onChangeText={setDiscountPercentage}
            />
          )}

          {offerType === "discount" && (
            <TextInput
              style={styles.input}
              placeholder="Discount %"
              placeholderTextColor="#777"
              keyboardType="numeric"
              value={discountPercentage}
              onChangeText={setDiscountPercentage}
            />
          )}

          {offerType === "promotion" && (
            <TextInput
              style={styles.itemInput}
              placeholder="Promotion Details"
              placeholderTextColor="#777"
              value={promotionDetails}
              onChangeText={setPromotionDetails}
              multiline
            />
          )}

          <OfferScheduleFields
            startDate={startDate}
            endDate={endDate}
            startTime={startTime}
            endTime={endTime}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
          />

          <View style={styles.switchRow}>
            <Text style={styles.white}>Active</Text>
            <Switch value={active} onValueChange={setActive} />
          </View>

          <TouchableOpacity
            style={[
              styles.createButton,
              loading && styles.disabledButton,
            ]}
            onPress={updateOffer}
            disabled={loading}
          >
            <Text style={styles.createText}>
              {loading ? "Saving..." : "SAVE CHANGES"}
            </Text>
          </TouchableOpacity>

          {showGroupModal && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Add Target Group</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Group name"
                  placeholderTextColor="#777"
                  value={newGroupName}
                  onChangeText={setNewGroupName}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowGroupModal(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={addTargetGroup}
                  >
                    <Text style={styles.saveText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {!!toast && <AdminToast message={toast} />}
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
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 25,
  },
  section: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
    marginVertical: 20,
  },
  input: {
    backgroundColor: "#111",
    color: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  image: {
    width: 120,
    height: 100,
    borderRadius: 15,
  },
  uploadBox: {
    width: 120,
    height: 100,
    borderRadius: 15,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  plus: {
    color: "#f4b400",
    fontSize: 40,
    fontWeight: "900",
  },
  uploadText: {
    color: "#aaa",
  },
  itemInput: {
    backgroundColor: "#111",
    color: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    minHeight: 90,
    textAlignVertical: "top",
  },
  itemDiscountInput: {
    backgroundColor: "#1b1b1b",
    color: "white",
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
  },
  typeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  typeCard: {
    flex: 1,
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 5,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#111",
  },
  selectedCard: {
    borderColor: "#f4b400",
  },
  typeEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  typeTitle: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
  typeSubtitle: {
    color: "#999",
    fontSize: 12,
    marginTop: 5,
  },
  groupContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  groupChip: {
    backgroundColor: "#111",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#333",
  },
  selectedChip: {
    backgroundColor: "#f4b400",
    borderColor: "#f4b400",
  },
  groupText: {
    color: "white",
    fontWeight: "700",
  },
  selectedGroupText: {
    color: "#000",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "#111",
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  categoryName: {
    color: "white",
    fontWeight: "900",
    fontSize: 15,
    flex: 1,
  },
  arrow: {
    color: "#f4b400",
    fontSize: 18,
    fontWeight: "900",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#1d1d1d",
  },
  checkbox: {
    fontSize: 18,
    marginRight: 10,
    color: "#f4b400",
  },
  checkboxText: {
    color: "white",
    flex: 1,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 25,
  },
  white: {
    color: "white",
    fontSize: 18,
  },
  createButton: {
    backgroundColor: "#f4b400",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  addGroupButton: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#f4b400",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
  },
  addGroupText: {
    color: "#f4b400",
    fontWeight: "900",
  },
  modalOverlay: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 20,
    justifyContent: "center",
  },
  modalBox: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 15,
  },
  modalTitle: {
    color: "#f4b400",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelButton: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
  },
  cancelText: {
    color: "white",
    fontWeight: "700",
  },
  saveButton: {
    backgroundColor: "#f4b400",
    padding: 12,
    borderRadius: 8,
  },
  saveText: {
    color: "#000",
    fontWeight: "900",
  },
});