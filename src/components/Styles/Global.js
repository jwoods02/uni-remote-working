import { StyleSheet } from "react-native";

const colours = StyleSheet.create({
  textPurple: { color: "#8A54A2" },
  backgroundPurple: { backgroundColor: "#8A54A2" }
});

const flex = StyleSheet.create({
  column: {
    flex: 1,
    flexDirection: "column"
  },
  row: {
    flex: 1,
    flexDirection: "row"
  }
});

export { colours, flex };
