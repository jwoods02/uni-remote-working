import React, { Component } from "react";
import { StyleSheet, ScrollView, ActivityIndicator, View } from "react-native";
import { List, ListItem, Text, Card, Button } from "react-native-elements";
import firebase from "firebase";

class LocationDetailScreen extends Component {
  static navigationOptions = {
    title: "Edit Board"
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      location: {},
      key: ""
    };
  }
  componentDidMount() {
    const { navigation } = this.props;
    const ref = firebase
      .firestore()
      .collection("locations")
      .doc(JSON.parse(navigation.getParam("locationkey")));
    ref.get().then(doc => {
      if (doc.exists) {
        this.setState({
          location: doc.data(),
          key: doc.id,
          isLoading: false
        });
      } else {
        console.log("No such document!");
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
      <ScrollView>
        <Card style={styles.container}>
          <View style={styles.subContainer}>
            <View>
              <Text h3>{this.state.location.title}</Text>
            </View>
            <View>
              <Text h5>{this.state.location.description}</Text>
            </View>
            <View>
              <Text h4>{this.state.location.image}</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#CCCCCC"
  },
  activity: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  detailButton: {
    marginTop: 10
  }
});

export default LocationDetailScreen;
