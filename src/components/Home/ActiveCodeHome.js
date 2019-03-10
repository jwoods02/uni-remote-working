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
  ActivityIndicator,
  Button,
  Alert,
  ScrollView
} from "react-native";

import firebase from "firebase";
import MapViewItems from "../Maps/MapComponents/MapViewItems";

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

export default class ActiveCodeHome extends Component {
  constructor() {
    super();
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

  _feedback() {
    Alert.alert("This is where feedback will be handled");
  }

  _howTo() {
    Alert.alert("This is where how to will be handled");
  }

  _removeCode() {
    Alert.alert("This is where the code will be removed");
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
        <View
          style={{
            backgroundColor: "white",
            maxHeight: 100,
            borderBottomWidth: 1,
            borderBottomColor: "#dddddd",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Button
              onPress={this._removeCode}
              title="Remove code"
              color="#FF0000"
            />
            <Text style={{ fontSize: 20, paddingTop: 8 }}>Cardiff Library</Text>
            <Button onPress={this._feedback} title="Feedback" />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingLeft: 8,
              paddingRight: 8
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 30 }}>
              {this.props.code}
            </Text>
            <Text style={{ fontSize: 20 }}>Valid for: 24hr</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Button onPress={this._howTo} title="How do I use this code?" />
          </View>
        </View>
        <View
          style={{
            minHeight: 300
          }}
        >
          <MapViewItems //the map
            region={this.state.region}
            markers={this.state.markers}
            animation={this.animation}
            navigation={this.props.navigation} // not sure why you have to pass navigation as prop to children components.
          />
        </View>
        <ScrollView
          style={{
            flex: 1,
            flexDirection: "column",
            borderTopWidth: 1,
            borderTopColor: "#dddddd"
          }}
        >
          <Text>Cardiff Library</Text>
          <Text>description</Text>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text>10 desks</Text>
            <Text>24 / 7 Access</Text>
            <Text>Kitchen Area</Text>
          </View>
          <Text>
            Information - Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Nam sollicitudin, tortor vitae ultrices eleifend, risus erat
            blandit sem, quis cursus orci lorem eget odio. Aliquam nulla arcu,
            sagittis non hendrerit interdum, feugiat vel sapien. Proin at tellus
            risus. Ut scelerisque non odio eget convallis. Aenean nec accumsan
            libero. Nunc hendrerit est eu varius viverra.
          </Text>
        </ScrollView>
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

AppRegistry.registerComponent("ActiveCodeHome", () => ActiveCodeHome);
