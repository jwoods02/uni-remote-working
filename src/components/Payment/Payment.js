import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  Text
} from "react-native";
import { List, ListItem, Button, Icon } from "react-native-elements";
import firebase from "firebase";
import Axios from "axios";

export default class Payment extends Component {
  callServer() {
    Axios.get("/api")
      .then(function(response) {
        // handle success
        console.log(response.data);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .then(function() {
        // always executed
        console.log("At least one thing happened");
      });
  }
  render() {
    return (
      <ScrollView>
        <Button
          style={{ top: 10, left: 0, right: 0, bottom: 0 }}
          title="Test"
          onPress={() => this.callServer()}
        />
      </ScrollView>
    );
  }
}
