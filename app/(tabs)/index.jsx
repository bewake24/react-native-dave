import { View, Text, StyleSheet, ImageBackground } from "react-native";
import React from "react";

const app = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://img.freepik.com/free-photo/abstract-empty-smooth-light-pink-studio-room-background-use-as-montage-product-display-banner-template_1258-82987.jpg?ga=GA1.1.346899304.1726347077&semt=ais_hybrid",
        }}
        resizeMode="stretch"
        style={styles.image}
      >
        <Text style={styles.text}>Startup News Fyi</Text>
      </ImageBackground>
    </View>
  );
};

export default app;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "#EE1962",
    backgroundColor: "#0000003e",
    padding: 10,
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
  },
});
