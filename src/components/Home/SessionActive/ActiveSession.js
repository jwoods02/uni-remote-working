// https://codedaily.io/tutorials/9/Build-a-Map-with-Custom-Animated-markers-and-Region-Focus-when-Content-is-Scrolled-in-React-Native
// https://github.com/browniefed/map_animated_scrollview/blob/master/index.ios.js

import React, { Component } from "react";
import {
  Text,
  View,
  Animated,
  ActivityIndicator,
  ScrollView
} from "react-native";

import MapViewItems from "../../Maps/MapComponents/MapViewItems";

import { styles } from "../../Styles/ActiveCodeHome";
import { colours, flex, justify } from "../../Styles/Global";
import EndSession from "./EndSession";

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      e => reject(e)
    );
  });
};

export default class ActiveSession extends Component {
  static navigationOptions = { title: "Your Code", headerLeft: null };

  constructor(props) {
    super(props);

    this.unsubscribe = null;

    this.state = {
      isLoading: true,
      markers: [],
      location: {},
      user: {},
      region: {
        //just a default incase snapshot fails - Cardiff
        latitude: 51.481583,
        longitude: -3.17909,
        latitudeDelta: 0.04864195044303443,
        longitudeDelta: 0.040142817690068
      },
      dialogVisible: false
    };
  }

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }

  async componentDidMount() {
    this.state = this.unsubscribe = this.props.session
      .data()
      .access_code.location.onSnapshot(this.onCollectionUpdate);

    const doc = await this.props.session.data().access_code.location.get();

    if (doc.exists) {
      this.setState({
        location: doc.data()
      });
    } else {
      console.log("No such document!");
    }

    getCurrentLocation().then(position => {
      if (position) {
        this.setState({
          region: {
            latitude: this.state.markers[0].coordinate.latitude,
            longitude: this.state.markers[0].coordinate.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03
          }
        });
      }
    });
  }

  onCollectionUpdate = doc => {
    const markers = [];
    const { title, description, image, coordinate, desks, info } = doc.data();
    markers.push({
      key: doc.id,
      title,
      description,
      image,
      coordinate,
      desks,
      info
    });

    this.setState({
      markers,
      isLoading: false
    });
  };

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
          style={[styles.headerContainer, flex.column, justify.spaceBetween]}
        >
          <View style={[justify.spaceBetween, flex.row, styles.firstInfoRow]}>
            <Text style={[styles.title, colours.textPurple]}>
              Your current session
            </Text>
          </View>
          <View
            style={[
              justify.spaceBetween,
              flex.row,
              {
                alignItems: "center"
              }
            ]}
          />
        </View>
        <ScrollView style={[styles.scrollContainer, flex.column]}>
          <View style={styles.mapContainer}>
            <MapViewItems //the map
              region={this.state.region}
              markers={this.state.markers}
              animation={this.animation}
              navigation={this.props.navigation}
            />
          </View>
          <View style={{ padding: 8 }}>
            <Text style={[styles.infoTitle, colours.textPurple]}>
              {this.state.markers[0].title}
            </Text>
            <Text style={styles.description}>
              Session Start Time :
              {" " +
                new Date(
                  this.props.session.data().start.seconds * 1000
                ).toLocaleTimeString("en-UK") +
                " on " +
                new Date(
                  this.props.session.data().start.seconds * 1000
                ).toLocaleDateString("en-UK")}{" "}
            </Text>
            <EndSession navigation={this.props.navigation} />
          </View>
        </ScrollView>
      </View>
    );
  }
}
