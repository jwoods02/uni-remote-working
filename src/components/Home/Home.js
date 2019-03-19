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
    try {
      const querySnapshot = await this.userRef.get();

      querySnapshot.forEach(doc => {
        this.setState({
          user: doc.id
        });
      });
      // console.log(this.state.user);
    } catch (err) {
      console.log(err);
    }

    this.handleRender();
  }

  async handleRender() {
    let userDocRef = firebase
      .firestore()
      .collection("users")
      .doc(this.state.user);

    // console.log(userDocRef);

    const querySnapshot = await firebase
      .firestore()
      .collection("sessions")
      .where("user", "==", userDocRef)
      .get();

    if (querySnapshot.empty) {
      console.log("no documents found");
      this.setState({
        hasCode: false,
        loading: false
      });
    } else {
      this.setState({
        session: querySnapshot.docs[0].data(),
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
            location={this.state.session.access_code.location}
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
