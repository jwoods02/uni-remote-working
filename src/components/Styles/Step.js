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
    backgroundColor: "#fff"
  },
  stepText: {
    fontSize: 30
  },
  active: {
    color: "#111"
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
    color: "#fff",
    fontSize: 25,
    padding: 5
  }
});

export { styles };
