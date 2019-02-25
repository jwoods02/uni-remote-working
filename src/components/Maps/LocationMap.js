// https://codedaily.io/tutorials/9/Build-a-Map-with-Custom-Animated-markers-and-Region-Focus-when-Content-is-Scrolled-in-React-Native
// https://github.com/browniefed/map_animated_scrollview/blob/master/index.ios.js

import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

import MapView from "react-native-maps";
import calloutSearch from "react-native-maps";
import { Callout } from "react-native-maps";
import firebase from "firebase";
import ScrollviewItems from "./Map Components/ScrollviewItems";
import MapSearch from "./Map Components/MapSearch";
import MapViewItems from "./Map Components/MapViewItems";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      e => reject(e)
    );
  });
};

export default class LocationMap extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection("locations");
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      markers: [],
      region: {
        latitude: 51.481583,
        longitude: -3.17909,
        latitudeDelta: 0.04864195044303443,
        longitudeDelta: 0.040142817690068
      }
    };
  }

  componentWillUnmount() {} //empty for now

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }
  componentDidMount() {
    this.state = this.unsubscribe = this.ref.onSnapshot(
      this.onCollectionUpdate
    );

    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here

    // this.animation.addListener(({ value }) => {
    //   let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
    //   if (index >= this.state.markers.length) {
    //     index = this.state.markers.length - 1;
    //   }
    //   if (index <= 0) {
    //     index = 0;
    //   }

    //   clearTimeout(this.regionTimeout);
    //   this.regionTimeout = setTimeout(() => {
    //     if (this.index !== index) {
    //       this.index = index;
    //       const { coordinate } = this.state.markers[index];
    //       this.map.animateToRegion(
    //         {
    //           ...coordinate,
    //           latitudeDelta: this.state.region.latitudeDelta,
    //           longitudeDelta: this.state.region.longitudeDelta
    //         },
    //         350
    //       );
    //     }
    //   }, 10);
    // });

    getCurrentLocation().then(position => {
      if (position) {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03
          }
        });
      }
    });
  }

  onCollectionUpdate = querySnapshot => {
    const markers = [];
    querySnapshot.forEach(doc => {
      const { title, description, image, coordinate } = doc.data();
      markers.push({
        key: doc.id,
        // doc, // DocumentSnapshot
        title,
        description,
        image,
        coordinate
      });
    });
    this.setState({
      markers,
      isLoading: false
    });
  };

  render() {
    console.log(this.state.markers);
    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    // const interpolations = this.state.markers.map((marker, index) => {
    //   const inputRange = [
    //     (index - 1) * CARD_WIDTH,
    //     index * CARD_WIDTH,
    //     (index + 1) * CARD_WIDTH
    //   ];
    //   const scale = this.animation.interpolate({
    //     inputRange,
    //     outputRange: [1, 2.5, 1],
    //     extrapolate: "clamp"
    //   });
    //   const opacity = this.animation.interpolate({
    //     inputRange,
    //     outputRange: [0.35, 1, 0.35],
    //     extrapolate: "clamp"
    //   });
    //   return { scale, opacity };
    // });

    return (
      <View style={styles.container}>
        <MapViewItems
          region={this.state.region}
          markers={this.state.markers}
          animation={this.animation}
        />
        {/* <MapView
          showsUserLocation={true}
          ref={map => (this.map = map)}
          region={{
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
            latitudeDelta: this.state.region.latitudeDelta,
            longitudeDelta: this.state.region.longitudeDelta
          }}
          style={styles.container}
        >
          {this.state.markers.map((marker, index) => {
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
        </MapView> */}

        <Callout>
          <MapSearch />
        </Callout>
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation
                  }
                }
              }
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          <ScrollviewItems markers={this.state.markers} />
        </Animated.ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH
  },
  textContent: {
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

AppRegistry.registerComponent("LocationMap", () => LocationMap);
