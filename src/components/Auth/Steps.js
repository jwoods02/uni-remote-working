import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { flex } from "../Styles/Global";
import AwesomeButton from "react-native-really-awesome-button";
import CustomIcon from "../../../assets/fonts/CustomIcon";

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
      <View style={[flex.column, styles.container]}>
        <Text
          style={[
            styles.step,
            pageCounter > 0 ? styles.complete : styles.active
          ]}
        >
          Step 1: Login details
          {pageCounter > 0 && <CustomIcon name="check-circle-o" size={25} />}
        </Text>

        <Text
          style={[
            styles.step,
            pageCounter === 1
              ? styles.active
              : pageCounter > 1
              ? styles.complete
              : styles.inactive
          ]}
        >
          Step 2: Payment details
          {pageCounter > 1 && <CustomIcon name="check-circle-o" size={25} />}
        </Text>

        <Text
          style={[
            styles.step,
            pageCounter === 2
              ? styles.active
              : pageCounter > 2
              ? styles.complete
              : styles.inactive
          ]}
        >
          Step 3: Enjoy!
          {pageCounter > 2 && <CustomIcon name="check-circle-o" size={25} />}
        </Text>

        <View style={styles.btnContainer}>
          <AwesomeButton backgroundColor={"#42a7f4"} onPress={this._navigateTo}>
            Go to next step
          </AwesomeButton>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center"
  },
  step: {
    fontSize: 30,
    paddingBottom: 15,
    paddingLeft: 10
  },
  active: {
    color: "#111"
  },
  inactive: {
    color: "#dddddd"
  },
  complete: {
    color: "green"
  },
  btnContainer: {
    paddingLeft: 10
  }
});
