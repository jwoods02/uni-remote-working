import React from "react";
import { Text, TextInput, View, Button, Image } from "react-native";
import firebase from "firebase";
import { styles } from "../Styles/Register";
import { colours } from "../Styles/Global";
import AwesomeButton from "react-native-really-awesome-button";

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
      <View style={[styles.container, colours.backgroundPurple]}>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}
        <Image
          style={{ marginBottom: 20 }}
          source={require("../../../assets/airbnb.png")}
        />
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          placeholder="First Name"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={firstName => this.setState({ firstName })}
          value={this.state.firstName}
        />
        <TextInput
          placeholder="Last Name"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={lastName => this.setState({ lastName })}
          value={this.state.lastName}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <TextInput
          secureTextEntry
          placeholder="Confirm Password"
          autoCapitalize="none"
          style={[styles.textInput, { marginBottom: 10 }]}
          onChangeText={confirmPassword => this.setState({ confirmPassword })}
          value={this.state.confirmPassword}
        />
        <View style={styles.buttonContainer}>
          <AwesomeButton
            backgroundColor={"#edeeef"}
            textColor={"#8A54A2"}
            width={100}
            onPress={this.handleSignUp}
          >
            Sign Up
          </AwesomeButton>
        </View>
        <View style={styles.bottomLink}>
          <Button
            title="Already have an account? Login"
            color="#edeeef"
            onPress={() => this.props.navigation.navigate("Login")}
          />
        </View>
      </View>
    );
  }
}
