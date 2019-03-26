import React from "react";
import { View, Text } from "react-native";
import { flex, colours } from "../Styles/Global";
import AwesomeButton from "react-native-really-awesome-button";
import CustomIcon from "../../../assets/fonts/CustomIcon";
import { styles } from "../Styles/Step";

var pageCounter = 0;

export default class Steps extends React.Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    if (this.props.navigation.getParam("reset", "") === true) {
      pageCounter = 0;
    }
  }

  _navigateTo = () => {
    const { navigation } = this.props;

    if (navigation.getParam("page", "")) {
      pageCounter = navigation.getParam("page", "");
    }

    switch (pageCounter) {
      case 0: {
        navigation.navigate("SignUp");
        break;
      }
      case 1: {
        const { navigation } = this.props;
        const email = navigation.getParam("email", "");
        navigation.navigate("Pay", { email });
        break;
      }
      case 2: {
        navigation.navigate("Home");
        break;
      }
      default: {
        break;
      }
    }
    pageCounter++;
  };

  render() {
    return (
      <View style={[flex.column, styles.container, colours.backgroundPurple]}>
        <View style={styles.step}>
          <Text
            style={[
              styles.stepText,
              pageCounter > 0 ? styles.complete : styles.active
            ]}
          >
            Step 1: Login details{" "}
          </Text>
          <Text
            style={[
              styles.stepText,
              { position: "absolute", right: 15, top: 19 },
              pageCounter > 0 ? styles.complete : styles.active
            ]}
          >
            {pageCounter > 0 && <CustomIcon name="check-circle-o" size={25} />}
          </Text>
          <Text
            style={[
              styles.description,
              pageCounter > 0 ? styles.complete : styles.active
            ]}
          >
            Register with us to use our services
          </Text>
        </View>

        <View style={styles.step}>
          <Text
            style={[
              styles.stepText,
              pageCounter === 1
                ? styles.active
                : pageCounter > 1
                ? styles.complete
                : styles.inactive
            ]}
          >
            Step 2: Payment details
          </Text>
          <Text
            style={[
              styles.stepText,
              { position: "absolute", right: 15, top: 19 },
              pageCounter === 1
                ? styles.active
                : pageCounter > 1
                ? styles.complete
                : styles.inactive
            ]}
          >
            {pageCounter > 1 && <CustomIcon name="check-circle-o" size={25} />}
          </Text>
          <Text
            style={[
              styles.description,
              pageCounter === 1
                ? styles.active
                : pageCounter > 1
                ? styles.complete
                : styles.inactive
            ]}
          >
            Pay us £20 now and we will automatically charge you for both your
            usage and subscription every month
          </Text>
        </View>

        <View style={styles.step}>
          <Text
            style={[
              styles.stepText,
              pageCounter === 2
                ? styles.active
                : pageCounter > 2
                ? styles.complete
                : styles.inactive
            ]}
          >
            Step 3: Enjoy
          </Text>
          <Text
            style={[
              styles.stepText,
              { position: "absolute", right: 15, top: 19 },
              pageCounter === 2
                ? styles.active
                : pageCounter > 2
                ? styles.complete
                : styles.inactive
            ]}
          >
            {pageCounter > 2 && <CustomIcon name="check-circle-o" size={25} />}
          </Text>
          <Text
            style={[
              styles.description,
              pageCounter === 2
                ? styles.active
                : pageCounter > 2
                ? styles.complete
                : styles.inactive
            ]}
          >
            You're all done! Let's get to work
          </Text>
        </View>

        <View style={styles.btnContainer}>
          <AwesomeButton
            backgroundColor={"#42a7f4"}
            width={150}
            onPress={this._navigateTo}
          >
            <Text style={styles.btnTxt}>Go to step {pageCounter + 1}</Text>
          </AwesomeButton>
        </View>
      </View>
    );
  }
}
