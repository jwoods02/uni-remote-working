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

class Settings extends Component {
  constructor() {
    super();
    this.unsubscribe = null;
    this.state = {
      isLoading: false
    };
  }

  signOutUser = async () => {
    try {
      await firebase.auth().signOut();
      this.props.navigation.navigate("SignUp");
    } catch (e) {
      console.log(e);
    }
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
      <ScrollView style={styles.container}>
        <List>
          <ListItem
            title="Log Out"
            leftIcon={{ name: "sign-out", type: "font-awesome" }}
            onPress={() => this.signOutUser()}
          />
        </List>

        <Button
          style={{ top: 10, left: 0, right: 0, bottom: 0 }}
          title="logout"
          onPress={() => this.signOutUser()}
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

export default Settings;
