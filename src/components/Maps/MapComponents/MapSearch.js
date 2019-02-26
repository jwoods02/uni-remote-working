import React, { Component } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default class MapSearch extends Component {
  render() {
    return (
      <View style={styles.calloutView}>
        <TextInput style={styles.calloutSearch} placeholder={"Search"} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  calloutView: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    width: "40%",
    marginLeft: "30%",
    marginRight: "30%",
    marginTop: 20
  },
  calloutSearch: {
    borderColor: "transparent",
    marginLeft: 10,
    width: "90%",
    marginRight: 10,
    height: 40,
    borderWidth: 0.0
  }
});
