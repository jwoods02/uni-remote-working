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
import MapViewItems from "../Maps/MapComponents/MapViewItems";
import Dialog from "react-native-dialog";
import { withUser } from "../Auth/Context/withUser";

import { styles } from "../Styles/ActiveCodeHome";
import { colours, flex, justify, align } from "../Styles/Global";
import AwesomeButton from "react-native-really-awesome-button";

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      e => reject(e)
    );
  });
};

class ActiveSession extends Component {
  static navigationOptions = { title: "Your Code", headerLeft: null };

  constructor(props) {
    super(props);
    console.log("USER BY CONTEXT:", this.props.userContext.user);

    this.unsubscribe = null;
    this.userRef = firebase
      .firestore()
      .collection("users")
      .where("auth", "==", this.props.userContext.user);
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

    try {
      const querySnapshot = await this.userRef.get();

      querySnapshot.forEach(doc => {
        this.setState({
          user: doc.id
        });
      });
      console.log("user after set state in DidMount", this.state.user);
    } catch (err) {
      console.log(err);
    }
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

  async manageSession() {
    console.log("user in manageSession", this.state.user);
    let userDocRef = firebase
      .firestore()
      .collection("users")
      .doc(this.state.user);

    const querySnapshot = await firebase
      .firestore()
      .collection("sessions")
      .where("user", "==", userDocRef)
      .get();

    if (querySnapshot.empty) {
      console.log("no documents found");
    } else {
      let snapshot = querySnapshot.docs[0];
      snapshot.ref.update({
        end: firebase.firestore.FieldValue.serverTimestamp(),
        minutes: parseInt(snapshot.end - snapshot.start)
      });

      this.setState({ dialogVisible: false });
      this.props.navigation.navigate("Settings");
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    console.log("end", this.props.session.data().end);

    return (
      <View style={styles.container}>
        <View
          style={[styles.headerContainer, flex.column, justify.spaceBetween]}
        >
          <View style={[justify.spaceBetween, flex.row, styles.firstInfoRow]}>
            <Text style={[styles.title, colours.textPurple]}>
              You current have an active session
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
                  this.props.session.data().access_code.expiry.seconds * 1000
                ).toLocaleTimeString("en-UK") +
                " on " +
                new Date(
                  this.props.session.data().access_code.expiry.seconds * 1000
                ).toLocaleDateString("en-UK")}{" "}
            </Text>

            <Text>{this.state.markers[0].info}</Text>
          </View>
          <View style={[flex.column, justify.center, align.center]}>
            <AwesomeButton
              backgroundColor={"#42a7f4"}
              width={200}
              onPress={() => this.setState({ dialogVisible: true })}
            >
              End session
            </AwesomeButton>
            <Dialog.Container visible={this.state.dialogVisible}>
              <Dialog.Description>
                Are you sure you want to end your session?
              </Dialog.Description>
              <Dialog.Button
                label="Cancel"
                onPress={() => this.setState({ dialogVisible: false })}
              />
              <Dialog.Button label="End" onPress={this.manageSession} />
            </Dialog.Container>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default withUser(ActiveSession);
