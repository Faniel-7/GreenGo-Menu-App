import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import AdminLayout from "../../components/admin/AdminLayout";
import AuthGuard from "../../components/admin/AuthGuard";
import { supabase } from "../../lib/supabase";

export default function Category() {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  const [category, setCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showMessage = useCallback((title, message) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  }, []);

  const loadData = useCallback(async (showLoader = false) => {
    if (!id) return;
    if (showLoader) setLoading(true);

    try {
      const { data: cat, error: catError } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

      if (catError) throw catError;
      setCategory(cat);

      const { data: imageData, error: imageError } = await supabase
        .from("category_images")
        .select("*")
        .eq("category_id", id);

      if (imageError) throw imageError;
      setImages(imageData || []);

      const { data: itemData, error: itemError } = await supabase
        .from("category_items")
        .select("*")
        .eq("category_id", id)
        .order("id");

      if (itemError) throw itemError;
      setItems(itemData || []);
    } catch (error) {
      console.error("CATEGORY LOAD ERROR:", error);
      showMessage("Loading Error", error?.message || "Could not load this category.");
    } finally {
      setLoading(false);
    }
  }, [id, showMessage]);

  useEffect(() => {
    loadData(true);
  }, [loadData]);

  function openAddModal() {
    setEditingItem(null);
    setItemName("");
    setItemPrice("");
    setModalVisible(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setItemName(item.name || "");
    setItemPrice(String(item.price ?? ""));
    setModalVisible(true);
  }

  async function saveItem() {
    const trimmedName = itemName.trim();
    const parsedPrice = Number(itemPrice);

    if (!trimmedName || !itemPrice.trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      showMessage("Invalid Item", "Enter an item name and a valid non-negative price.");
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        const { error } = await supabase
          .from("category_items")
          .update({ name: trimmedName, price: parsedPrice })
          .eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("category_items")
          .insert({
            category_id: id,
            name: trimmedName,
            price: parsedPrice,
            active: true,
          });
        if (error) throw error;
      }

      setModalVisible(false);
      await loadData();
    } catch (error) {
      console.error("SAVE ITEM ERROR:", error);
      showMessage("Save Error", error?.message || "Could not save this item.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item) {
    try {
      const newActive = !item.active;
      const { error } = await supabase
        .from("category_items")
        .update({ active: newActive })
        .eq("id", item.id);

      if (error) throw error;

      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id
            ? { ...currentItem, active: newActive }
            : currentItem
        )
      );
    } catch (error) {
      console.error("TOGGLE ITEM ERROR:", error);
      showMessage("Update Error", error?.message || "Could not change this item's visibility.");
    }
  }

  function requestDeleteItem(item) {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  }

  async function confirmDeleteItem() {
    if (!itemToDelete || deleting) return;

    setDeleting(true);
    try {
      // Remove offer references first so an item's use in an offer does not
      // prevent its deletion through a foreign-key constraint.
      const { error: offerLinksError } = await supabase
        .from("offer_items")
        .delete()
        .eq("item_id", itemToDelete.id);

      if (offerLinksError) throw offerLinksError;

      const { data: deletedItems, error: deleteError } = await supabase
        .from("category_items")
        .delete()
        .eq("id", itemToDelete.id)
        .select("id");

      if (deleteError) throw deleteError;
      if (!deletedItems || deletedItems.length === 0) {
        throw new Error("The item was not deleted. Check your database permissions and try again.");
      }

      setItems((current) => current.filter((item) => item.id !== itemToDelete.id));
      setDeleteModalVisible(false);
      setItemToDelete(null);
      showMessage("Item Deleted", "The menu item was deleted successfully.");
    } catch (error) {
      console.error("DELETE ITEM ERROR:", error);
      showMessage(
        "Delete Error",
        error?.message || "Could not delete this item. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AuthGuard>
      <AdminLayout>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#f4b400" />
              <Text style={styles.loadingText}>Loading category...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.title}>{category?.name || "Category"}</Text>

              {images.length > 0 && (
                <View style={styles.imageRow}>
                  {images.map((img) => (
                    <Image
                      key={img.id}
                      source={{ uri: img.image_url }}
                      style={[styles.image, isMobile && styles.mobileImage]}
                    />
                  ))}
                </View>
              )}

              <Text style={styles.section}>Items</Text>

              {items.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateTitle}>No items yet</Text>
                  <Text style={styles.emptyStateText}>
                    Add a menu item to this category to get started.
                  </Text>
                </View>
              ) : (
                items.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.itemCard,
                      isMobile && styles.mobileItemCard,
                    ]}
                  >
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.price}>{item.price} ETB</Text>
                      <Text
                        style={[
                          styles.itemStatus,
                          { color: item.active ? "#00ff88" : "#ff7777" },
                        ]}
                      >
                        {item.active ? "● Active" : "● Hidden"}
                      </Text>
                    </View>

                    <View style={[styles.buttons, isMobile && styles.mobileButtons]}>
                      <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={`Edit ${item.name}`}
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => openEditModal(item)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.actionButtonText}>✏️ Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={`${item.active ? "Hide" : "Show"} ${item.name}`}
                        style={[styles.actionButton, styles.hideButton]}
                        onPress={() => toggleActive(item)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.actionButtonText}>
                          👁 {item.active ? "Hide" : "Show"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${item.name}`}
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => requestDeleteItem(item)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.actionButtonText}>🗑 Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}

              <TouchableOpacity
                accessibilityRole="button"
                style={styles.addButton}
                onPress={openAddModal}
                activeOpacity={0.85}
              >
                <Text style={styles.addText}>+ Add Item</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        {/* Add / Edit item modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => !saving && setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={[styles.modal, isMobile && styles.mobileModal]}>
              <Text style={styles.modalTitle}>
                {editingItem ? "Edit Item" : "Add Item"}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Food name"
                placeholderTextColor="#777"
                value={itemName}
                onChangeText={setItemName}
                editable={!saving}
                returnKeyType="next"
              />

              <TextInput
                style={styles.input}
                placeholder="Price (ETB)"
                placeholderTextColor="#777"
                keyboardType="decimal-pad"
                value={itemPrice}
                onChangeText={setItemPrice}
                editable={!saving}
              />

              <TouchableOpacity
                style={[styles.modalPrimaryButton, saving && styles.disabledButton]}
                onPress={saveItem}
                disabled={saving}
                activeOpacity={0.85}
              >
                {saving ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.modalPrimaryText}>Save</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
                disabled={saving}
                activeOpacity={0.85}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Cross-platform delete confirmation */}
        <Modal
          visible={deleteModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => !deleting && setDeleteModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={[styles.modal, styles.confirmModal, isMobile && styles.mobileModal]}>
              <Text style={styles.modalTitle}>Delete Item?</Text>
              <Text style={styles.confirmText}>
                Are you sure you want to delete “{itemToDelete?.name || "this item"}”? This cannot be undone.
              </Text>

              <View style={[styles.confirmActions, isMobile && styles.mobileConfirmActions]}>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.modalCancelButton, isMobile && styles.mobileConfirmButton]}
                  onPress={() => setDeleteModalVisible(false)}
                  disabled={deleting}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.confirmButton, styles.confirmDeleteButton, isMobile && styles.mobileConfirmButton, deleting && styles.disabledButton]}
                  onPress={confirmDeleteItem}
                  disabled={deleting}
                  activeOpacity={0.85}
                >
                  {deleting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.confirmDeleteText}>Delete Item</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </AdminLayout>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030303",
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    color: "#f4b400",
    fontSize: 35,
    fontWeight: "900",
    marginBottom: 4,
  },
  section: {
    color: "white",
    fontSize: 25,
    fontWeight: "900",
    marginTop: 24,
    marginBottom: 18,
  },
  loadingContainer: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#aaa",
    fontSize: 15,
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 20,
  },
  image: {
    width: 130,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#151515",
  },
  mobileImage: {
    width: 105,
    height: 85,
  },
  itemCard: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 15,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "#242424",
  },
  mobileItemCard: {
    flexDirection: "column",
    alignItems: "stretch",
    padding: 14,
    gap: 14,
  },
  itemDetails: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    flexShrink: 1,
  },
  price: {
    color: "#f4b400",
    marginTop: 5,
    fontSize: 15,
    fontWeight: "700",
  },
  itemStatus: {
    marginTop: 7,
    fontSize: 13,
    fontWeight: "700",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    gap: 10,
  },
  mobileButtons: {
    width: "100%",
    justifyContent: "space-between",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    minWidth: 0,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "#1a1a1a",
  },
  editButton: {
    borderColor: "#f4b400",
  },
  hideButton: {
    borderColor: "#444",
  },
  deleteButton: {
    borderColor: "#8b3a3a",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#f4b400",
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  addText: {
    fontWeight: "900",
    color: "#000",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.78)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#111",
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#333",
  },
  mobileModal: {
    padding: 20,
  },
  modalTitle: {
    color: "#f4b400",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 18,
  },
  input: {
    width: "100%",
    backgroundColor: "#222",
    color: "white",
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  modalPrimaryButton: {
    minHeight: 48,
    backgroundColor: "#f4b400",
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  modalPrimaryText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 15,
  },
  modalCancelButton: {
    minHeight: 44,
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#444",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  modalCancelText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  confirmModal: {
    maxWidth: 440,
  },
  confirmText: {
    color: "#ddd",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  confirmActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  mobileConfirmActions: {
    flexDirection: "column-reverse",
    alignItems: "stretch",
    gap: 0,
  },
  confirmButton: {
    flex: 1,
    marginTop: 0,
    minHeight: 46,
  },
  mobileConfirmButton: {
    width: "100%",
    flex: 0,
    marginTop: 10,
  },
  confirmDeleteButton: {
    backgroundColor: "#a82424",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmDeleteText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.65,
  },
  emptyState: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 22,
    borderWidth: 1,
    borderColor: "#242424",
  },
  emptyStateTitle: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 17,
  },
  emptyStateText: {
    color: "#999",
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
});
