// https://codedaily.io/tutorials/9/Build-a-Map-with-Custom-Animated-markers-and-Region-Focus-when-Content-is-Scrolled-in-React-Native
// https://github.com/browniefed/map_animated_scrollview/blob/master/index.ios.js

import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  ActivityIndicator
} from "react-native";

import { Callout } from "react-native-maps";
import firebase from "firebase";
import ScrollViewItems from "./MapComponents/ScrollViewItems";
import MapSearch from "./MapComponents/MapSearch";
import MapViewItems from "./MapComponents/MapViewItems";
import { withUser } from "../Auth/Context/withUser";

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

class LocationMap extends Component {
  constructor() {
    super();
    this.updateRegionFromSearch = this.updateRegionFromSearch.bind(this);

    this.ref = firebase.firestore().collection("locations");
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      markers: [],
      region: {
        //just a default incase snapshot fails - Cardiff
        latitude: 51.481583,
        longitude: -3.17909,
        latitudeDelta: 0.04864195044303443,
        longitudeDelta: 0.040142817690068
      }
    };
  }

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }
  componentDidMount() {
    this.state = this.unsubscribe = this.ref.onSnapshot(
      this.onCollectionUpdate
    );

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

  updateRegionFromSearch(lat, lng) {
    this.setState({
      region: {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03
      }
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <MapViewItems //the map
          region={this.state.region}
          markers={this.state.markers}
          animation={this.animation}
          navigation={this.props.navigation} // not sure why you have to pass navigation as prop to children components.
        />
        <Callout>
          {/* search */}
          <MapSearch updateRegionFromSearch={this.updateRegionFromSearch} />
        </Callout>
        {/* animation */}
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
          <ScrollViewItems
            markers={this.state.markers}
            navigation={this.props.navigation} //not sure why you have to pass navigation as prop to children components.
          />
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
  }
});
export default withUser(LocationMap);
