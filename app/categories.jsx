import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";

const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://startupnews.fyi/wp-json/wp/v2/categories?per_page=100&page=1"
      );
      const data = await response.json(); // Parse JSON
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (id) => {
    setSelectedCategory(selectedCategory === id ? null : id);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.button,
        selectedCategory === item.id && styles.selectedButton,
      ]}
      onPress={() => toggleCategory(item.id)}
    >
      <Text
        style={[
          styles.buttonText,
          selectedCategory === item.id && styles.selectedButtonText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Post Categories</Text>

      <View style={styles.view}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={[styles.list, styles.flatView]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa", // Set a proper background color
    padding: 20,
    paddingBottom: 60,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  list: {
    alignItems: "center",
  },
  button: {
    padding: 12,
    color: "green",
    backgroundColor: "#007bff",
    borderRadius: 58,
    marginVertical: 5,
    margin: 4,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedButtonText: {
    color: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatView: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default CategoriesScreen;
