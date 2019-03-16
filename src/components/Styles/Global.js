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

const justify = StyleSheet.create({
  spaceBetween: { justifyContent: "space-between" }
});

const align = StyleSheet.create({
  center: { alignItems: "center" }
});

export { colours, flex, justify, align };
