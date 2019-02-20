import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Constants, Location, Permissions } from "expo";
import MapView from "react-native-maps";

export default class AppProvider extends Component {
  state = {
    number: 10
  };

  render() {
    return <AppContext.Provider value={this.state} />;
  }
}
