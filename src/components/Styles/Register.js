import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {
    height: 40,
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
    backgroundColor: "#edeeef",
    borderRadius: 5,
    padding: 5
  },
  buttonContainer: {
    margin: 10
  },
  bottomLink: {
    position: "absolute",
    bottom: 15
  },
  image: {
    color: "white"
  }
});

export { styles };
