import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Image,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import AdminLayout from "../../components/admin/AdminLayout";
import AuthGuard from "../../components/admin/AuthGuard";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";

export default function CreateCategory() {
  const router = useRouter();

  // --------------------------------------------------
  // CATEGORY
  // --------------------------------------------------

  const [name, setName] = useState("");
  const [menuType, setMenuType] = useState("standard");
  const [active, setActive] = useState(true);

  // --------------------------------------------------
  // IMAGES
  // Exactly 3 images for the category template
  // --------------------------------------------------

  const [images, setImages] = useState<string[]>([]);

  // --------------------------------------------------
  // ITEMS
  // --------------------------------------------------

  const [items, setItems] = useState([
    {
      name: "",
      price: "",
      section: "",
    },
  ]);

  const [creating, setCreating] = useState(false);

  // --------------------------------------------------
  // SLUG
  // --------------------------------------------------

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // --------------------------------------------------
  // PICK IMAGE
  // --------------------------------------------------

  async function pickImage() {
    if (images.length >= 3) {
      Alert.alert(
        "Maximum images",
        "A category can have exactly 3 template images."
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

        allowsEditing: true,

        aspect: [4, 3],

        quality: 0.8,
      });

    if (!result.canceled) {
      setImages([
        ...images,
        result.assets[0].uri,
      ]);
    }
  }

  // --------------------------------------------------
  // REMOVE IMAGE
  // --------------------------------------------------

  function removeImage(index: number) {
    setImages(
      images.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  }

  // --------------------------------------------------
  // ADD ITEM
  // --------------------------------------------------

  function addItem() {
    setItems([
      ...items,
      {
        name: "",
        price: "",
        section: "",
      },
    ]);
  }

  // --------------------------------------------------
  // REMOVE ITEM
  // --------------------------------------------------

  function removeItem(index: number) {
    if (items.length === 1) {
      return;
    }

    setItems(
      items.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  }

  // --------------------------------------------------
  // UPDATE ITEM
  // --------------------------------------------------

  function updateItem(
    index: number,
    key: string,
    value: string
  ) {
    const updated = [...items];

    updated[index] = {
      ...updated[index],
      [key]: value,
    };

    setItems(updated);
  }

  // --------------------------------------------------
  // UPLOAD IMAGE TO SUPABASE STORAGE
  // --------------------------------------------------

  async function uploadImage(
    uri: string,
    categorySlug: string,
    imageIndex: number
  ) {
    const response = await fetch(uri);

    const arrayBuffer =
      await response.arrayBuffer();

    const fileName =
      `${categorySlug}-${Date.now()}-${imageIndex}.jpg`;

    const filePath =
      `categories/${fileName}`;

    const { error } =
      await supabase.storage
        .from("menu-images")
        .upload(
          filePath,
          arrayBuffer,
          {
            contentType:
              "image/jpeg",
            upsert: false,
          }
        );

    if (error) {
      throw error;
    }

    const { data } =
      supabase.storage
        .from("menu-images")
        .getPublicUrl(
          filePath
        );

    return data.publicUrl;
  }

  // --------------------------------------------------
  // CREATE CATEGORY
  // --------------------------------------------------

  async function createCategory() {
    if (!name.trim()) {
      Alert.alert(
        "Error",
        "Category name is required."
      );
      return;
    }

    // We need exactly 3 images
    if (images.length !== 3) {
      Alert.alert(
        "Images required",
        "Please upload exactly 3 images for the category."
      );
      return;
    }

    // Validate items
    const validItems =
      items.filter(
        (item) =>
          item.name.trim() &&
          item.price !== ""
      );

    if (validItems.length === 0) {
      Alert.alert(
        "Items required",
        "Please add at least one menu item."
      );
      return;
    }

    // Validate prices
    const invalidPrice =
      validItems.some(
        (item) =>
          Number.isNaN(
            Number(item.price)
          )
      );

    if (invalidPrice) {
      Alert.alert(
        "Invalid price",
        "Please make sure every item has a valid price."
      );
      return;
    }

    // Section menus need section names
    if (menuType === "section") {
      const missingSection =
        validItems.some(
          (item) =>
            !item.section.trim()
        );

      if (missingSection) {
        Alert.alert(
          "Section required",
          "Every item in a section menu must have a section name."
        );
        return;
      }
    }

    try {
      setCreating(true);

      const categoryName =
        name.trim();

      const slug =
        createSlug(categoryName);

      // ------------------------------------------------
      // 1. CREATE CATEGORY
      // ------------------------------------------------

      const {
        data: category,
        error: categoryError,
      } = await supabase
        .from("categories")
        .insert({
          name: categoryName,
          slug: slug,
          active: active,
          menu_type: menuType,
        })
        .select()
        .single();

      if (categoryError) {
        throw categoryError;
      }

      if (!category) {
        throw new Error(
          "Category was not created."
        );
      }

      // ------------------------------------------------
      // 2. UPLOAD THE 3 CATEGORY IMAGES
      // ------------------------------------------------

      for (
        let i = 0;
        i < images.length;
        i++
      ) {
        const imageUrl =
          await uploadImage(
            images[i],
            slug,
            i + 1
          );

        const {
          error: imageError,
        } = await supabase
          .from("category_images")
          .insert({
            category_id:
              category.id,
            image_url:
              imageUrl,
          });

        if (imageError) {
          throw imageError;
        }
      }

      // ------------------------------------------------
      // 3. CREATE CATEGORY ITEMS
      // ------------------------------------------------

      const insertItems =
        validItems.map(
          (item) => ({
            category_id:
              category.id,

            name:
              item.name.trim(),

            price:
              Number(item.price),

            active: true,

            section:
              menuType === "section"
                ? item.section.trim()
                : null,
          })
        );

      const {
        error: itemError,
      } = await supabase
        .from("category_items")
        .insert(insertItems);
if (itemError) {
        throw itemError;
      }

      // ------------------------------------------------
      // SUCCESS
      // ------------------------------------------------

      Alert.alert(
        "Category Created",
        `${categoryName} has been created successfully.`,
        [
          {
            text: "OK",
            onPress: () =>
              router.back(),
          },
        ]
      );
    } catch (error) {
      console.log(
        "Create category error:",
        error
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the category.";

      Alert.alert(
        "Error",
        errorMessage
      );
    } finally {
      setCreating(false);
    }
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <AuthGuard>
      <AdminLayout>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={
            false
          }
        >
          {/* BACK */}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.back()
            }
          >
            <Ionicons
              name="arrow-back"
              size={28}
              color="#f4b400"
            />

            <Text
              style={styles.backText}
            >
              Back
            </Text>
          </TouchableOpacity>

          {/* TITLE */}

          <Text style={styles.title}>
            Create Category
          </Text>

          <Text
            style={styles.description}
          >
            Create a new menu category
            using the GreenGo menu
            template.
          </Text>

          {/* -------------------------------------- */}
          {/* CATEGORY INFORMATION */}
          {/* -------------------------------------- */}

          <View
            style={styles.card}
          >
            <Text
              style={styles.cardTitle}
            >
              Category Information
            </Text>

            <Text
              style={styles.label}
            >
              Category Name
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Example: Desserts"
              placeholderTextColor="#777"
              value={name}
              onChangeText={setName}
            />

            {/* MENU TYPE */}

            <Text
              style={[
                styles.label,
                {
                  marginTop: 20,
                },
              ]}
            >
              Menu Type
            </Text>

            <View
              style={styles.typeRow}
            >
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  menuType ===
                    "standard" &&
                    styles.typeButtonActive,
                ]}
                onPress={() =>
                  setMenuType(
                    "standard"
                  )
                }
              >
                <Ionicons
                  name="restaurant"
                  size={22}
                  color={
                    menuType ===
                    "standard"
                      ? "#000"
                      : "#f4b400"
                  }
                />

                <View>
                  <Text
                    style={[
                      styles.typeTitle,
                      menuType ===
                        "standard" &&
                        styles.typeTitleActive,
                    ]}
                  >
                    Standard
                  </Text>

                  <Text
                    style={[
                      styles.typeDescription,
menuType ===
                        "standard" &&
                        styles.typeDescriptionActive,
                    ]}
                  >
                    One menu
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  menuType ===
                    "section" &&
                    styles.typeButtonActive,
                ]}
                onPress={() =>
                  setMenuType(
                    "section"
                  )
                }
              >
                <Ionicons
                  name="layers"
                  size={22}
                  color={
                    menuType ===
                    "section"
                      ? "#000"
                      : "#f4b400"
                  }
                />

                <View>
                  <Text
                    style={[
                      styles.typeTitle,
                      menuType ===
                        "section" &&
                        styles.typeTitleActive,
                    ]}
                  >
                    Section Menu
                  </Text>

                  <Text
                    style={[
                      styles.typeDescription,
                      menuType ===
                        "section" &&
                        styles.typeDescriptionActive,
                    ]}
                  >
                    One menu, multiple
                    sections
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* ACTIVE */}

            <View
              style={styles.switchRow}
            >
              <View>
                <Text
                  style={styles.white}
                >
                  Show Category
                </Text>

                <Text
                  style={styles.helper}
                >
                  Make this category
                  visible in the sidebar.
                </Text>
              </View>

              <Switch
                value={active}
                onValueChange={
                  setActive
                }
              />
            </View>
          </View>

          {/* -------------------------------------- */}
          {/* IMAGES */}
          {/* -------------------------------------- */}

          <View
            style={styles.card}
          >
            <View
              style={
                styles.sectionHeader
              }
            >
              <View>
                <Text
                  style={styles.cardTitle}
                >
                  Category Images
                </Text>

                <Text
                  style={styles.helper}
                >
                  Upload 3 images for the
                  right side of the menu.
                </Text>
              </View>

              <Text
                style={styles.counter}
              >
                {images.length}/3
              </Text>
            </View>

            <View
              style={styles.imageRow}
            >
              {images.map(
                (img, index) => (
                  <View
                    key={index}
                    style={
                      styles.imageContainer
                    }
                  >
                    <Image
                      source={{
                        uri: img,
                      }}
                      style={
                        styles.image
                      }
                    />

                    <TouchableOpacity
                      style={
                        styles.removeImage
}
                      onPress={() =>
                        removeImage(
                          index
                        )
                      }
                    >
                      <Ionicons
                        name="close"
                        size={18}
                        color="white"
                      />
                    </TouchableOpacity>

                    <View
                      style={
                        styles.imageNumber
                      }
                    >
                      <Text
                        style={
                          styles.imageNumberText
                        }
                      >
                        {index + 1}
                      </Text>
                    </View>
                  </View>
                )
              )}

              {images.length <
                3 && (
                <TouchableOpacity
                  style={
                    styles.uploadBox
                  }
                  onPress={
                    pickImage
                  }
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={34}
                    color="#f4b400"
                  />

                  <Text
                    style={
                      styles.uploadText
                    }
                  >
                    Add Image
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* -------------------------------------- */}
          {/* ITEMS */}
          {/* -------------------------------------- */}

          <View
            style={styles.card}
          >
            <View
              style={
                styles.sectionHeader
              }
            >
              <View>
                <Text
                  style={styles.cardTitle}
                >
                  Menu Items
                </Text>

                <Text
                  style={styles.helper}
                >
                  Add as many items as
                  you need.
                </Text>
              </View>

              <Text
                style={styles.counter}
              >
                {items.length}
              </Text>
            </View>

            {items.map(
              (item, index) => (
                <View
                  key={index}
                  style={
                    styles.itemBox
                  }
                >
                  <View
                    style={
                      styles.itemHeader
                    }
                  >
                    <Text
                      style={
                        styles.itemNumber
                      }
                    >
                      ITEM {index + 1}
                    </Text>

                    {items.length >
                      1 && (
                      <TouchableOpacity
                        onPress={() =>
                          removeItem(
                            index
                          )
                        }
                      >
                        <Ionicons
                          name="trash-outline"
                          size={21}
                          color="#ff5555"
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  <TextInput
                    style={
                      styles.itemInput
                    }
                    placeholder="Food / Drink name"
                    placeholderTextColor="#777"
                    value={
                      item.name
                    }
onChangeText={(
                      value
                    ) =>
                      updateItem(
                        index,
                        "name",
                        value
                      )
                    }
                  />

                  <TextInput
                    style={
                      styles.itemInput
                    }
                    placeholder="Price"
                    placeholderTextColor="#777"
                    keyboardType="numeric"
                    value={
                      item.price
                    }
                    onChangeText={(
                      value
                    ) =>
                      updateItem(
                        index,
                        "price",
                        value
                      )
                    }
                  />

                  {menuType ===
                    "section" && (
                    <TextInput
                      style={
                        styles.itemInput
                      }
                      placeholder="Section (e.g. Coffee, Tea)"
                      placeholderTextColor="#777"
                      value={
                        item.section
                      }
                      onChangeText={(
                        value
                      ) =>
                        updateItem(
                          index,
                          "section",
                          value
                        )
                      }
                    />
                  )}
                </View>
              )
            )}

            <TouchableOpacity
              style={
                styles.addButton
              }
              onPress={addItem}
            >
              <Ionicons
                name="add-circle-outline"
                size={22}
                color="#f4b400"
              />

              <Text
                style={styles.addText}
              >
                Add Another Item
              </Text>
            </TouchableOpacity>
          </View>

          {/* -------------------------------------- */}
          {/* CREATE */}
          {/* -------------------------------------- */}

          <TouchableOpacity
            style={[
              styles.createButton,
              creating &&
                styles.createButtonDisabled,
            ]}
            onPress={
              createCategory
            }
            disabled={creating}
          >
            <Ionicons
              name={
                creating
                  ? "hourglass-outline"
                  : "checkmark-circle-outline"
              }
              size={24}
              color="#000"
            />

            <Text
              style={
                styles.createText
              }
            >
              {creating
                ? "CREATING..."
                : "CREATE CATEGORY"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </AdminLayout>
    </AuthGuard>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#030303",
      padding: 20,
    },

    backButton: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },

    backText: {
      color: "#f4b400",
      fontSize: 18,
      fontWeight: "900",
      marginLeft: 10,
    },

    title: {
      color: "#f4b400",
      fontSize: 34,
      fontWeight: "900",
      marginBottom: 8,
    },

    description: {
      color: "#888",
      fontSize: 15,
      marginBottom: 25,
    },

    card: {
      backgroundColor:
        "#0d0d0d",
      borderWidth: 1,
      borderColor:
        "#222",
      borderRadius: 18,
      padding: 20,
      marginBottom: 20,
    },

    cardTitle: {
      color: "white",
      fontSize: 22,
      fontWeight: "900",
      marginBottom: 6,
    },
label: {
      color: "#f4b400",
      fontSize: 15,
      fontWeight: "800",
      marginBottom: 8,
    },

    input: {
      backgroundColor:
        "#181818",
      color: "white",
      padding: 15,
      borderRadius: 12,
      borderWidth: 1,
      borderColor:
        "#292929",
      fontSize: 16,
    },

    typeRow: {
      flexDirection: "row",
      gap: 12,
    },

    typeButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor:
        "#181818",
      borderWidth: 1,
      borderColor:
        "#292929",
      borderRadius: 14,
      padding: 14,
    },

    typeButtonActive: {
      backgroundColor:
        "#f4b400",
      borderColor:
        "#f4b400",
    },

    typeTitle: {
      color: "white",
      fontSize: 15,
      fontWeight: "900",
    },

    typeTitleActive: {
      color: "#000",
    },

    typeDescription: {
      color: "#777",
      fontSize: 12,
      marginTop: 3,
    },

    typeDescriptionActive: {
      color: "#333",
    },

    switchRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginTop: 25,
    },

    white: {
      color: "white",
      fontSize: 17,
      fontWeight: "800",
    },

    helper: {
      color: "#777",
      fontSize: 12,
      marginTop: 4,
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginBottom: 18,
    },

    counter: {
      color: "#f4b400",
      fontSize: 18,
      fontWeight: "900",
    },

    imageRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 15,
    },

    imageContainer: {
      position: "relative",
    },

    image: {
      width: 125,
      height: 105,
      borderRadius: 14,
    },

    removeImage: {
      position: "absolute",
      top: 6,
      right: 6,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor:
        "rgba(0,0,0,0.8)",
      justifyContent:
        "center",
      alignItems: "center",
    },

    imageNumber: {
      position: "absolute",
      bottom: 6,
      left: 6,
      width: 25,
      height: 25,
      borderRadius: 13,
      backgroundColor:
        "#f4b400",
      justifyContent:
        "center",
      alignItems: "center",
    },

    imageNumberText: {
      color: "#000",
      fontWeight: "900",
    },

    uploadBox: {
      width: 125,
      height: 105,
      borderRadius: 14,
      backgroundColor:
        "#151515",
      borderWidth: 1,
      borderStyle:
        "dashed",
      borderColor:
        "#f4b400",
      justifyContent:
        "center",
      alignItems: "center",
    },

    uploadText: {
      color: "#aaa",
      marginTop: 6,
      fontWeight: "700",
    },

    itemBox: {
      backgroundColor:
        "#151515",
      borderRadius: 14,
      padding: 15,
      marginBottom: 15,
      borderWidth: 1,
      borderColor:
        "#252525",
    },

    itemHeader: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginBottom: 12,
    },

    itemNumber: {
      color: "#f4b400",
      fontSize: 13,
      fontWeight: "900",
    },

    itemInput: {
      backgroundColor:
        "#222",
      color: "white",
      padding: 13,
      borderRadius: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor:
        "#2d2d2d",
    },

    addButton: {
      flexDirection: "row",
      justifyContent:
        "center",
      alignItems: "center",
      gap: 8,
      padding: 15,
      borderWidth: 1,
      borderColor:
        "#f4b400",
      borderRadius: 12,
    },

    addText: {
      color: "#f4b400",
      fontWeight: "900",
      fontSize: 15,
    },

    createButton: {
      flexDirection: "row",
      justifyContent:
        "center",
      alignItems: "center",
      gap: 10,
      backgroundColor:
        "#f4b400",
      padding: 18,
      borderRadius: 15,
      marginBottom: 40,
    },
createButtonDisabled: {
      opacity: 0.5,
    },

    createText: {
      fontWeight: "900",
      color: "#000",
      fontSize: 16,
    },
  });