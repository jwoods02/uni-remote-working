import React, { Component } from "react";
import { StyleSheet, ScrollView, TextInput, View, Text } from "react-native";
import { List, ListItem, Button, Icon } from "react-native-elements";
import firebase from "firebase";
import axios from "axios";

export default class Payment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      field1: "",
      field2: "",
      errorMessage: null
    };
  }

  callServer() {
    axios
      .get("/api")
      .then(function(response) {
        // handle success
        console.log(response.data);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .then(function() {
        // always executed
        console.log("At least one thing happened");
      });
  }

  handlePay = () => {
    const { field1, field2 } = this.state;
    console.log(field1, field2);

    axios
      .post("/api", {
        field1: "field1",
        field2: "field2"
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .then(function() {
        // always executed
        console.log("At least one thing happened");
      });
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text>Login</Text>
          {this.state.errorMessage && (
            <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
          )}
          <TextInput
            autoCapitalize="none"
            style={styles.textInput}
            placeholder="Field 1"
            onChangeText={field1 => this.setState({ field1 })}
            value={this.state.field1}
          />
          <TextInput
            autoCapitalize="none"
            style={styles.textInput}
            placeholder="Field 2"
            onChangeText={field2 => this.setState({ field2 })}
            value={this.state.field2}
          />
          <Button title="Pay" onPress={this.handlePay} />
        </View>
        <Button
          style={{ top: 10, left: 0, right: 0, bottom: 0 }}
          title="Test Get"
          onPress={() => this.callServer()}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {
    height: 40,
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8
  }
});
