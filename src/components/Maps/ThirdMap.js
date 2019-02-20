import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Constants, Location, Permissions } from "expo";
import MapView from "react-native-maps";

export default class ThirdMap extends Component {
  state = {
    locationResult: null
  };

  componentDidMount() {
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        locationResult: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location) });
  };

  render() {
    return (
      <MapView
        showsUserLocation={true}
        style={styles.map}
        initialRegion={{
          latitude: this.state.locationResult.latitude,
          longitude: this.state.locationResult.longitude,
          latitudeDelta: this.state.locationResult.latitudeDelta,
          longitudeDelta: this.state.locationResult.longitudeDelta
        }}
      />
    );
  }
}

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
