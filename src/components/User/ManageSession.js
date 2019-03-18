import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  Text
} from "react-native";
import { Font } from "expo";
import { ListItem, Button, Icon } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";
import firebase from "firebase";
import { withUser } from "../Auth/Context/withUser";

class ManageSession extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection("session");
    console.log(this.props.userContext.user);
    this.userRef = firebase
      .firestore()
      .collection("users")
      .where("auth", "==", this.props.userContext.user);

    this.accessCodeRef = firebase
      .firestore()
      .collection("access_codes")
      .where("user", "==", "users/" + this.props.userContext.user);
    this.state = {
      user: {},
      access_code: {}
    };
  }

  async componentDidMount() {
    try {
      // const querySnapshot = await this.userRef.get();

      // querySnapshot.forEach(doc => {
      //   this.setState({
      //     user: doc.data()
      //   });
      // });
      // console.log(this.state.user);

      const userQuerySnapshot = await firebase
        .firestore()
        .collection("access_codes")
        .where("user", "==", this.userRef)
        .get();

      userQuerySnapshot.forEach(doc => {
        console.log("DOC DATA: " + doc.data);
        this.setState({
          access_code: doc.data()
        });
      });
      console.log(this.state.access_code);
    } catch (err) {
      console.log(err);
    }
  }

  startSession() {
    this.ref
      .add({
        user_id: this.props.userContext.user,
        // location: this.state.location,
        start: firebase.firestore.FieldValue.serverTimestamp(),
        end: null,
        interval_minutes: null
      })

      .catch(error => {
        console.error("Error adding document: ", error);
      });
  }

  endSession() {
    firebase
      .firestore()
      .collection("session")
      .where("user_id", "==", this.props.userContext.user)
      .update({ end: firebase.firestore.FieldValue.serverTimestamp() });
  }

  render() {
    console.log(this.props.userContext.user);

    return (
      <ScrollView style={styles.container}>
        <ListItem
          title="Start Session"
          leftIcon={{
            name: "play-circle",
            type: "font-awesome",
            color: "green"
          }}
          onPress={() => this.startSession()}
        />
        <ListItem
          title="End Session"
          leftIcon={{ name: "stop-circle", type: "font-awesome", color: "red" }}
          onPress={() => this.endSession()}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  },
  activity: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default withUser(ManageSession);
