import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ImageSlider from "react-native-image-slider";
import AwesomeButton from "react-native-really-awesome-button";

export default class LandingPage extends React.Component {
  render() {
    const carouselImages = [
      require("../../../assets/pointer.png"),
      require("../../../assets/tick.png"),
      require("../../../assets/pointer.png")
    ];

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>This is the top text for the view</Text>
        </View>
        <View style={styles.carousel}>
          <ImageSlider
            images={carouselImages}
            style={{ height: 300, flex: 0 }}
          />
        </View>
        <View style={styles.registerBtn}>
          <AwesomeButton
            backgroundColor={"#42a7f4"}
            width={100}
            onPress={() => this.props.navigation.navigate("SignUp")}
          >
            Get Started
          </AwesomeButton>
        </View>
        <View style={styles.loginBtn}>
          <AwesomeButton
            backgroundColor={"#42a7f4"}
            width={100}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            Login
          </AwesomeButton>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleContainer: {
    alignItems: "center"
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    top: 10
  },
  carousel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center"
  },
  loginBtn: {
    position: "absolute",
    bottom: 10,
    right: 10
  },
  registerBtn: {
    position: "absolute",
    bottom: 10,
    left: 10
  }
});
