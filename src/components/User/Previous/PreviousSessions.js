import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView
} from "react-native";

import firebase from "firebase";
import SessionListItem from "./SessionListItem";

export default class PreviousSessions extends Component {
  constructor(props) {
    super(props);
    console.log("current user firebase auth", firebase.auth().currentUser.uid);
    this.userRef = firebase
      .firestore()
      .collection("users")
      .where("auth", "==", firebase.auth().currentUser.uid);

    this.state = {
      user: null,
      hasCode: false,
      loading: true
    };
  }

  async componentDidMount() {
    this.componentFocused();

    this.sub = this.props.navigation.addListener(
      "didFocus",
      this.componentFocused
    );
  }

  componentWillUnmount() {
    this.sub.remove();
  }

  componentFocused = async () => {
    this.setState({
      loading: true
    });
    try {
      const userQuerySnapshot = await this.userRef.get();
      this.setState({
        user: userQuerySnapshot.docs[0].id
      });
    } catch (err) {
      console.log(err);
    }

    await this.handleRender();
  };

  async handleRender() {
    const userDocRef = firebase
      .firestore()
      .collection("users")
      .doc(this.state.user);

    const sessionQuerySnapshot = await firebase
      .firestore()
      .collection("sessions")
      .where("user", "==", userDocRef)
      .get();

    if (sessionQuerySnapshot.empty) {
      console.log("no documents found");
      this.setState({
        hasCode: false,
        loading: false
      });
    } else {
      const previousSessions = sessionQuerySnapshot.docs;
      this.setState({
        previousSessions,
        hasCode: true,
        loading: false
      });
    }
  }

  render() {
    // console.log(this.state.previousSessions);
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <Text>Loading</Text>
          <ActivityIndicator size="large" color="rgba(130,4,150, 0.4)" />
        </View>
      );
    } else {
      allSessions = [];
      this.state.previousSessions.forEach(session => {
        allSessions.push(<SessionListItem session={session} />);
      });
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <ScrollView scrollEventThrottle={16}>
              <View
                style={{ flex: 1, backgroundColor: "white", paddingTop: 20 }}
              >
                {allSessions}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
