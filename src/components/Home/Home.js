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
  TouchableOpacity
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import FavouritesCarousel from "./FavouritesCarousel";
import firebase from "firebase";
import ActiveCodeHome from "./ActiveCodeHome";
import DefaultHome from "./DefaultHome";

const { height, width } = Dimensions.get("window");

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCode: false
    };
  }

  render() {
    if (this.state.hasCode) {
      return <ActiveCodeHome navigation={this.props.navigation} />;
    }
    return <DefaultHome navigation={this.props.navigation} />;
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
