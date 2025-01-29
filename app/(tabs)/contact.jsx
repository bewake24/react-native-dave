import { StyleSheet, View, Text } from "react-native";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contact Us</Text>
      <Text style={styles.para}>
        Email: 8Ow8B@example.com DOTFYI Media Ventures Private Limited. 1-E/3,
        First Floor, Block E 1, Jhandewalan Extension, Next to Jhandewalan Metro
        Station, New Delhi, Delhi 110055
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000",
  },
  header: {
    fontWeight: "bold",
    fontSize: 36,
    color: "#fff",
    marginBottom: 10,
  },
  para: {
    color: "#fff",
    textAlign: "center",
  },
});
