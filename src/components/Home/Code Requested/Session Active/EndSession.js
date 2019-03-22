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
import Dialog from "react-native-dialog";
import { colours, flex, justify, align } from "../../../Styles/Global";
import AwesomeButton from "react-native-really-awesome-button";

import firebase from "firebase";
import { withUser } from "../../../Auth/Context/withUser";

class EndSession extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection("session");
    this.userRef = firebase
      .firestore()
      .collection("users")
      .where("auth", "==", this.props.userContext.user);

    this.state = {
      user: {},
      access_code: {},
      dialogVisible: false
    };
  }
  async componentWillMount() {
    await Font.loadAsync({
      FontAwesome: require("@expo/vector-icons/fonts/FontAwesome.ttf")
    });
    await Font.loadAsync({
      "Material Icons": require("@expo/vector-icons/fonts/MaterialIcons.ttf")
    });

    this.setState({ isLoading: false });
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

  async manageSession() {
    let userDocRef = firebase
      .firestore()
      .collection("users")
      .doc(this.state.user);

    const querySnapshot = await firebase
      .firestore()
      .collection("sessions")
      .where("end", "==", null)
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
      this.props.navigation.replace("Home");
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
    return (
      <ScrollView>
        <View style={[flex.column, justify.center, align.center]}>
          <AwesomeButton
            backgroundColor={"red"}
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
            <Dialog.Button label="End" onPress={() => this.manageSession()} />
          </Dialog.Container>
        </View>
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

export default withUser(EndSession);
