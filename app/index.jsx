import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";
import React from "react";
import { primaryColor } from "../constants/styles";
import { Link } from "expo-router";

const App = () => {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1735760672905-954da053c445?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8",
      }}
      style={styles.background}
    >
      <View style={styles.view}>
        <Text style={styles.text}>App</Text>
        <Link href={"/contact"} asChild>
          <Pressable>
            <Text style={styles.link}>Contact</Text>
          </Pressable>
        </Link>
        <Link href={"/menu"} asChild>
          <Pressable>
            <Text style={styles.link}>Events</Text>
          </Pressable>
        </Link>
        <Link href={"/categories"} asChild>
          <Pressable>
            <Text style={styles.link}>Categories</Text>
          </Pressable>
        </Link>
      </View>
    </ImageBackground>
  );
};

export default App;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: primaryColor,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    color: "#fff",
  },
});
