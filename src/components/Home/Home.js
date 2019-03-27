import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import firebase from "firebase";
import ActiveCodeHome from "./CodeRequested/ActiveCodeHome";
import ActiveSession from "./SessionActive/ActiveSession";

import DefaultHome from "./Default/DefaultHome";

export default class Home extends Component {
  constructor(props) {
    super(props);
    console.log(
      "USER ID FROM HOME USING Firebase Auth",
      firebase.auth().currentUser.uid
    );
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

      const sessionQuerySnapshot = await firebase
        .firestore()
        .collection("sessions")
        .where("user", "==", userQuerySnapshot.docs[0].ref)
        .where("end", "==", null)
        .get();

      if (!sessionQuerySnapshot.empty) {
        sessionQuerySnapshot.docs[0].ref.onSnapshot(
          {
            includeMetadataChanges: true
          },
          async () => {
            await this.handleRender();
          }
        );
      }
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
      .where("end", "==", null)
      .get();

    if (sessionQuerySnapshot.empty) {
      console.log("no documents found");
      this.setState({
        hasCode: false,
        loading: false
      });
    } else {
      const session = sessionQuerySnapshot.docs[0];
      this.setState({
        session,
        hasCode: true,
        loading: false
      });
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <Text>Loading</Text>
          <ActivityIndicator size="large" color="rgba(130,4,150, 0.4)" />
        </View>
      );
    } else {
      if (this.state.hasCode && this.state.session.data().start === null) {
        return (
          <ActiveCodeHome
            navigation={this.props.navigation}
            session={this.state.session}
            user={this.state.user}
          />
        );
      } else if (
        this.state.hasCode &&
        this.state.session.data().start != null
      ) {
        return (
          <ActiveSession
            navigation={this.props.navigation}
            session={this.state.session}
          />
        );
      } else {
        return <DefaultHome navigation={this.props.navigation} />;
      }
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
