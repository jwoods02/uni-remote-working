import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    backgroundColor: "white",
    maxHeight: 80,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    paddingLeft: 5,
    paddingRight: 5
  },
  title: {
    fontWeight: "700",
    fontSize: 24
  },
  infoBorderRight: {
    paddingRight: 5,
    borderRightWidth: 2,
    borderRightColor: "gray"
  },
  infoContainer: {
    paddingBottom: 10
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "700",
    paddingBottom: 10,
    paddingTop: 5
  },
  scrollContainer: {
    borderTopWidth: 1,
    borderTopColor: "#dddddd"
  },
  mapContainer: {
    minHeight: 300
  },
  description: {
    fontSize: 15,
    paddingBottom: 10,
    color: "gray"
  },
  firstInfoRow: {
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8
  }
});

export { styles };
