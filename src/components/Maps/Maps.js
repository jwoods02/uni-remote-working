import MapView from "react-native-maps";
import React, { Component } from "react";

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

var mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] }
];

class Maps extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 45.52220671242907,
          longitude: -122.6653281029795,
          latitudeDelta: 0.04864195044303443,
          longitudeDelta: 0.040142817690068
        }}
      />
    );
  }
}

export default Maps;
