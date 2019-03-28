import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center"
  },
  step: {
    padding: 15,
    borderWidth: 2,
    borderColor: "#dedede",
    borderRadius: 5,
    margin: 10,
    backgroundColor: "#fff",
    shadowOffset: { width: 4, height: 4 },
    shadowColor: "black",
    shadowOpacity: 1.0
  },
  stepText: {
    fontSize: 30
  },
  active: {
    color: "#8A54A2"
  },
  inactive: {
    color: "#dddddd"
  },
  complete: {
    color: "green"
  },
  btnContainer: {
    paddingLeft: 10,
    alignItems: "center",
    marginTop: 10
  },
  btnTxt: {
    color: "#8A54A2",
    fontSize: 25,
    padding: 5
  },
  description: {
    fontSize: 15,
    opacity: 0.8
  }
});

export { styles };
