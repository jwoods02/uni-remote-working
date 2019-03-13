import React from "react";
import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import { Input } from "react-native-elements";
import firebase from "firebase";
export default class SignUp extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection("users");
    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      errorMessage: null
    };
  }

  static navigationOptions = { header: null };

  handleSignUp = async () => {
    const {
      email,
      firstName,
      lastName,
      password,
      confirmPassword
    } = this.state;

    if (password !== confirmPassword) {
      this.setState({ errorMessage: "Ensure password fields match" });
    }

    if (!this.state.errorMessage) {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);

        await this.ref.add({
          auth: firebase.auth().currentUser.uid,
          email: email,
          firstName: firstName,
          lastName: lastName
        });

        this.props.navigation.navigate("Pay", { email });
      } catch (error) {
        this.setState({ errorMessage: error.message });
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}
        <Input
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <Input
          placeholder="First Name"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={firstName => this.setState({ firstName })}
          value={this.state.firstName}
        />
        <Input
          placeholder="Last Name"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={lastName => this.setState({ lastName })}
          value={this.state.lastName}
        />
        <Input
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Input
          secureTextEntry
          placeholder="Confirm Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={confirmPassword => this.setState({ confirmPassword })}
          value={this.state.confirmPassword}
        />
        <Button title="Sign Up" onPress={this.handleSignUp} />
        <Button title="Already have an account? Login" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {}
});
