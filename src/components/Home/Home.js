import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Platform,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  Button,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import FavouritesCarousel from "./FavouritesCarousel";
import firebase from "firebase";
import ActiveCodeHome from "./ActiveCodeHome";
import DefaultHome from "./DefaultHome";
import { withUser } from "../Auth/Context/withUser";
import { Font, AppLoading } from "expo";
import Loading from "../Auth/Loading";
import { NavigationEvents } from "react-navigation";

const { height, width } = Dimensions.get("window");

class Home extends Component {
  constructor(props) {
    super(props);
    this.userRef = firebase
      .firestore()
      .collection("users")
      .where("auth", "==", this.props.userContext.user);
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
      if (this.state.hasCode) {
        return (
          <ActiveCodeHome
            navigation={this.props.navigation}
            session={this.state.session}
          />
        );
      }
      return <DefaultHome navigation={this.props.navigation} />;
    }
  }
}

export default withUser(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
