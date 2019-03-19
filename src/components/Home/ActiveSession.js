// https://codedaily.io/tutorials/9/Build-a-Map-with-Custom-Animated-markers-and-Region-Focus-when-Content-is-Scrolled-in-React-Native
// https://github.com/browniefed/map_animated_scrollview/blob/master/index.ios.js

import React, { Component } from "react";
import { AppRegistry, Text, View, ActivityIndicator } from "react-native";

import AwesomeButton from "react-native-really-awesome-button";
import Dialog from "react-native-dialog";

import { flex, justify, align } from "../Styles/Global";

export default class ActiveSession extends Component {
  static navigationOptions = { title: "Home", headerLeft: null };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dialogVisible: false
    };
  }

  end = () => {
    // Remove code
    this.setState({ dialogVisible: false });
    this.props.navigation.navigate("Home");
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <View style={[flex.column, justify.center, align.center]}>
        {/* This will be changed to pull the name of the building */}
        <Text style={{ fontSize: 30 }}>Name of the building</Text>
        <Text style={{ fontSize: 24, paddingBottom: 20 }}>
          Session length: 2hrs
        </Text>
        <AwesomeButton
          backgroundColor={"#42a7f4"}
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
          <Dialog.Button label="End" onPress={this.end} />
        </Dialog.Container>
      </View>
    );
  }
}

AppRegistry.registerComponent("ActiveSession", () => ActiveSession);
