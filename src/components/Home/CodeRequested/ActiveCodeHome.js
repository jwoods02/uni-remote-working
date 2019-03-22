// https://codedaily.io/tutorials/9/Build-a-Map-with-Custom-Animated-markers-and-Region-Focus-when-Content-is-Scrolled-in-React-Native
// https://github.com/browniefed/map_animated_scrollview/blob/master/index.ios.js

import React, { Component } from "react";
import {
  AppRegistry,
  Text,
  View,
  Animated,
  ActivityIndicator,
  Button,
  Alert,
  ScrollView
} from "react-native";

import firebase from "firebase";
import MapViewItems from "../../Maps/MapComponents/MapViewItems";

import Dialog from "react-native-dialog";

import { styles } from "../../Styles/ActiveCodeHome";

import { colours, flex, justify } from "../../Styles/Global";

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      e => reject(e)
    );
  });
};

export default class ActiveCodeHome extends Component {
  static navigationOptions = { title: "Your Code", headerLeft: null };

  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      markers: [],
      location: {},
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

  _howTo() {
    Alert.alert(
      "The code in the top right of the screen is used to enter the building. When you enter the building, you will begin to be charged."
    );
  }

  _removeCode = () => {
    this.setState({ dialogVisible: true });
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleRemove = () => {
    this.setState({ dialogVisible: false });
    this.setState({
      isLoading: true
    });
    firebase
      .firestore()
      .collection("sessions")
      .doc(this.props.session.id)
      .delete()
      .then(() => {
        this.setState({
          isLoading: false
        });
        this.props.navigation.replace("Home");
      })
      .catch(error => {
        console.error("Error removing document: ", error);
        this.setState({
          isLoading: false
        });
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
              {this.state.markers[0].title}
            </Text>
            <Text style={styles.title}>
              {this.props.session.data().access_code.code}
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
          >
            <Button
              onPress={this._removeCode}
              title="X Remove code"
              color="#FF0000"
            />
            <Text style={{ fontSize: 12, paddingRight: 10 }}>
              Expiry:
              {" " +
                new Date(
                  this.props.session.data().access_code.expiry.seconds * 1000
                ).toLocaleTimeString("en-US") +
                " on " +
                new Date(
                  this.props.session.data().access_code.expiry.seconds * 1000
                ).toLocaleDateString("en-UK")}
            </Text>
          </View>
        </View>
        <ScrollView style={[styles.scrollContainer, flex.column]}>
          <Button onPress={this._howTo} title="How do I use this code?" />
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
              {this.state.markers[0].description}
            </Text>
            <View style={[styles.infoContainer, flex.row, justify.center]}>
              <View style={styles.infoBorderRight}>
                <Text>{this.state.markers[0].desks} desks</Text>
              </View>
              <View
                style={[
                  styles.infoBorderRight,
                  {
                    paddingLeft: 5
                  }
                ]}
              >
                <Text>24 / 7 Access</Text>
              </View>
              <View style={{ paddingLeft: 5 }}>
                <Text>Kitchen Area</Text>
              </View>
            </View>
            <Text>{this.state.markers[0].info}</Text>
          </View>
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Description>
              Are you sure you want to remove your access code?
            </Dialog.Description>
            <Dialog.Button label="Cancel" onPress={this.handleCancel} />
            <Dialog.Button label="Remove" onPress={this.handleRemove} />
          </Dialog.Container>
        </ScrollView>
      </View>
    );
  }
}

AppRegistry.registerComponent("ActiveCodeHome", () => ActiveCodeHome);
