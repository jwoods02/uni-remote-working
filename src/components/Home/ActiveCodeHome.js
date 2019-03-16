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
import Dialog from "react-native-dialog";

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
  static navigationOptions = { title: "Home", headerLeft: null };

  constructor(props) {
    super(props);
    this.ref = firebase
      .firestore()
      .collection("locations")
      .doc(props.navigation.state.params.docId);
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
      },
      dialogVisible: false
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
    const { title, description, image, coordinate, desks } = doc.data();
    markers.push({
      key: doc.id,
      title,
      description,
      image,
      coordinate,
      desks
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
    this.props.navigation.navigate("Home");
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
        <View style={styles.headerContainer}>
          <View
            style={[
              styles.headerRow,
              {
                paddingTop: 8,
                paddingLeft: 8,
                paddingRight: 8
              }
            ]}
          >
            <Text style={styles.title}>{this.state.markers[0].title}</Text>
            <Text style={styles.code}>
              {this.props.navigation.state.params.code}
            </Text>
          </View>
          <View
            style={[
              styles.headerRow,
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
            <Text style={{ fontSize: 20, paddingRight: 10 }}>
              Valid for: 24hr
            </Text>
          </View>
        </View>
        <ScrollView style={styles.scrollContainer}>
          <Button onPress={this._howTo} title="How do I use this code?" />
          <View style={styles.mapContainer}>
            <MapViewItems //the map
              region={this.state.region}
              markers={this.state.markers}
              animation={this.animation}
              navigation={this.props.navigation} // not sure why you have to pass navigation as prop to children components.
            />
          </View>
          <View style={{ padding: 8 }}>
            <Text style={styles.infoTitle}>{this.state.markers[0].title}</Text>
            <Text style={{ fontSize: 15, paddingBottom: 10, color: "gray" }}>
              {this.state.markers[0].description}
            </Text>
            <View style={styles.infoContainer}>
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
            <Text>
              Information - Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Nam sollicitudin, tortor vitae ultrices eleifend, risus erat
              blandit sem, quis cursus orci lorem eget odio. Aliquam nulla arcu,
              sagittis non hendrerit interdum, feugiat vel sapien. Proin at
              tellus risus. Ut scelerisque non odio eget convallis. Aenean nec
              accumsan libero. Nunc hendrerit est eu varius viverra.
            </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    backgroundColor: "white",
    maxHeight: 80,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingLeft: 5,
    paddingRight: 5
  },
  headerRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  code: { fontWeight: "700", fontSize: 24 },
  title: {
    color: "#8A54A2",
    fontWeight: "700",
    fontSize: 24
  },
  infoBorderRight: {
    paddingRight: 5,
    borderRightWidth: 2,
    borderRightColor: "gray"
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 10
  },
  infoTitle: {
    color: "#8A54A2",
    fontSize: 20,
    fontWeight: "700",
    paddingBottom: 10,
    paddingTop: 5
  },
  scrollContainer: {
    flex: 1,
    flexDirection: "column",
    borderTopWidth: 1,
    borderTopColor: "#dddddd"
  },
  mapContainer: {
    minHeight: 300
  }
});

AppRegistry.registerComponent("ActiveCodeHome", () => ActiveCodeHome);
