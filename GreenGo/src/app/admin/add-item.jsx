import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddItemPage() {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        ADD MENU ITEM
      </Text>

      {/* Food image */}

      <Text style={styles.label}>
        Food Image
      </Text>

      <TouchableOpacity style={styles.imageBox}>
        <Ionicons
          name="camera"
          size={40}
          color="#f4b400"
        />

        <Text style={styles.imageText}>
          Upload image
        </Text>
      </TouchableOpacity>

      {/* Name */}

      <Text style={styles.label}>
        Item Name
      </Text>

      <TextInput
        placeholder="Pizza"
        placeholderTextColor="#666"
        style={styles.input}
      />

      {/* Price */}

      <Text style={styles.label}>
        Price (ETB)
      </Text>

      <TextInput
        placeholder="850"
        keyboardType="numeric"
        placeholderTextColor="#666"
        style={styles.input}
      />

      {/* Description */}

      <Text style={styles.label}>
        Description
      </Text>

      <TextInput
        multiline
        numberOfLines={4}
        placeholder="Write a short description..."
        placeholderTextColor="#666"
        style={[styles.input, styles.description]}
      />

      {/* Category */}

      <Text style={styles.label}>
        Category
      </Text>

      <View style={styles.categoryContainer}>
        {[
          "Pizza",
          "Burger",
          "Chinese",
          "Rice",
          "Coffee",
          "Juice",
          "Breakfast",
          "Salad",
        ].map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryButton}
          >
            <Text style={styles.categoryText}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Availability */}

      <Text style={styles.label}>
        Availability
      </Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.statusButton}>
          <Text style={styles.statusText}>
            Available
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statusButton}>
          <Text style={styles.statusText}>
            Hidden
          </Text>
        </TouchableOpacity>
      </View>

      {/* Save */}

      <TouchableOpacity style={styles.saveButton}>
        <Ionicons
          name="save"
          size={22}
          color="#fff"
        />

        <Text style={styles.saveText}>
          Save Item
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030303",
    padding: 18,
  },

  title: {
    color: "#f4b400",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 25,
  },

  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 10,
  },

  imageBox: {
    height: 180,
    borderWidth: 2,
    borderColor: "#f4b400",
    borderStyle: "dashed",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },

  imageText: {
    color: "#f4b400",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
  },

  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 16,
    color: "#fff",
    fontSize: 16,
  },

  description: {
    textAlignVertical: "top",
    height: 120,
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  categoryButton: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
  },

  categoryText: {
    color: "#fff",
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },
statusButton: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  statusText: {
    color: "#fff",
    fontWeight: "700",
  },

  saveButton: {
    backgroundColor: "#1ecb00",
    marginTop: 30,
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 10,
  },
});