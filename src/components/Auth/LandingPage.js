import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import Swiper from "react-native-swiper";
import CustomIcon from "../../../assets/fonts/CustomIcon";
import { Font, AppLoading } from "expo";

const { height } = Dimensions.get("window");

export default class LandingPage extends React.Component {
  static navigationOptions = { header: null };

  async componentWillMount() {
    await Font.loadAsync({
      icomoon: require("../../../assets/fonts/icomoon.ttf")
    });
    this.setState({ loading: false });
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  render() {
    if (this.state.loading) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <View style={styles.swiperContainer}>
          <Swiper loop={false}>
            <View style={styles.slide}>
              <Text style={styles.title}>
                Find a dedicated workspace, anywhere
              </Text>
              <CustomIcon name="location" size={250} style={styles.image} />
            </View>
            <View style={styles.slide}>
              <Text style={styles.title}>
                Quality coffee, reliable internet, 24/7
              </Text>
              <CustomIcon
                name="check-circle-o"
                size={250}
                style={styles.image}
              />
            </View>
            <View style={styles.slide}>
              <Text style={styles.title}>
                Access spaces, get to work, instantly
              </Text>
              <CustomIcon name="clock" size={250} style={styles.image} />
            </View>
          </Swiper>
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
    flex: 1,
    paddingTop: 70
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    width: 250,
    position: "absolute",
    top: 40,
    paddingBottom: 50,
    paddingLeft: 5,
    paddingRight: 5
  },
  image: {
    paddingTop: 50
  },
  carousel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center"
  },
  loginBtn: {
    position: "absolute",
    bottom: 20,
    right: 15
  },
  registerBtn: {
    position: "absolute",
    bottom: 20,
    left: 15
  },
  swiperContainer: {
    height: height - 175,
    position: "relative",
    bottom: 0
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  }
});
