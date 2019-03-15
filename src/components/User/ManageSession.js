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
  constructor() {
    super();
    this.ref = firebase.firestore().collection("session");
    this.state = {
      user_id: "",
      location_id: "",
      start: null,
      end: null,
      interval_minutes: null
    };
  }

  componentDidMount() {
    this.onPaymentSuccess();
  }

  onPaymentSuccess = async token => {
    try {
      const querySnapshot = await firebase
        .firestore()
        .collection("session")
        .where("user_id", "==", this.props.userContext.user)
        .get();
      if (querySnapshot != null) {
        querySnapshot.forEach(doc => {
          let session = doc.data();
          // console.log(session);
        });
      }
      this.setState({
        user_id: querySnapshot.doc.data.user_id,
        location_id: querySnapshot.doc.data.location_id,
        start: querySnapshot.doc.data.start,
        end: querySnapshot.doc.data.end,
        interval_minutes: querySnapshot.doc.data.interval_minutes
      });

      // console.log(querySnapshot);
    } catch (err) {
      console.log(err);
    }
  };

  startSession() {
    this.ref
      .add({
        user_id: this.props.userContext.user,
        location_id: "w91B6KDWcF04jsybJgAP",
        start: firebase.firestore.FieldValue.serverTimestamp(),
        end: null,
        interval_minutes: null
      })

      .catch(error => {
        console.error("Error adding document: ", error);
      });
  }
  render() {
    // console.log(this.props.userContext.user);
    console.log(this.state);

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
        />
        <ListItem
          title={this.state.user_id}
          leftIcon={{ name: "stop-circle", type: "font-awesome", color: "red" }}
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
