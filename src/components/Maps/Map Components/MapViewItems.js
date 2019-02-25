import React, { Component } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Animated,
  Dimensions
} from "react-native";
import MapView from "react-native-maps";
import { Callout } from "react-native-maps";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default class MapViewItems extends Component {
  componentWillMount() {
    this.index = 0;
    this.animation = this.props.animation;
    console.log("WILLMOUNT");
  }

  componentDidMount() {
    console.log("DIDMOUNT");

    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.props.markers.length) {
        index = this.props.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.props.markers[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.props.region.latitudeDelta,
              longitudeDelta: this.props.region.longitudeDelta
            },
            350
          );
        }
      }, 10);
    });
  }
  render() {
    const interpolations = this.props.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        (index + 1) * CARD_WIDTH
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp"
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp"
      });
      return { scale, opacity };
    });
    return (
      <MapView
        showsUserLocation={true}
        ref={map => (this.map = map)}
        region={{
          latitude: this.props.region.latitude,
          longitude: this.props.region.longitude,
          latitudeDelta: this.props.region.latitudeDelta,
          longitudeDelta: this.props.region.longitudeDelta
        }}
        style={styles.container}
      >
        {this.props.markers.map((marker, index) => {
          const scaleStyle = {
            transform: [
              {
                scale: interpolations[index].scale
              }
            ]
          };
          const opacityStyle = {
            opacity: interpolations[index].opacity
          };
          return (
            <MapView.Marker key={index} coordinate={marker.coordinate}>
              <Animated.View style={[styles.markerWrap, opacityStyle]}>
                <Animated.View style={[styles.ring, scaleStyle]} />
                <View style={styles.marker} />
              </Animated.View>
            </MapView.Marker>
          );
        })}
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  markerWrap: {
    alignItems: "center",
    justifyContent: "center"
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)"
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)"
  }
});
