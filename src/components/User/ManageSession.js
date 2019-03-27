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
    this.userRef = firebase
      .firestore()
      .collection("users")
      .where("auth", "==", firebase.auth().currentUser.uid);

    this.state = {
      user: {},
      access_code: {}
    };
  }

  async componentDidMount() {
    try {
      const querySnapshot = await this.userRef.get();

      querySnapshot.forEach(doc => {
        this.setState({
          user: doc.id
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  async manageSession(action) {
    let userDocRef = firebase
      .firestore()
      .collection("users")
      .doc(this.state.user);

    const querySnapshot = await firebase
      .firestore()
      .collection("sessions")
      .where("start", "==", null)
      .where("user", "==", userDocRef)
      .get();

    if (querySnapshot.empty) {
      console.log("no documents found");
    } else {
      let snapshot = querySnapshot.docs[0];

      if (action === "start") {
        snapshot.ref.update({
          start: firebase.firestore.FieldValue.serverTimestamp()
        });
      } else {
        snapshot.ref.update({
          end: firebase.firestore.FieldValue.serverTimestamp(),
          minutes: parseInt(snapshot.end - snapshot.start)
        });
      }
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <ListItem
          title="Start Session"
          leftIcon={{
            name: "play-circle",
            type: "font-awesome",
            color: "green"
          }}
          onPress={() => this.manageSession("start")}
        />
        <ListItem
          title="End Session"
          leftIcon={{ name: "stop-circle", type: "font-awesome", color: "red" }}
          onPress={() => this.manageSession("end")}
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
