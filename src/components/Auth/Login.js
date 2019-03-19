import React from "react";
import { Text, TextInput, View, Button, Image } from "react-native";
import firebase from "firebase";
import { withUser } from "../Auth/Context/withUser";
import { styles } from "../Styles/Register";
import { colours } from "../Styles/Global";
import AwesomeButton from "react-native-really-awesome-button";

class Login extends React.Component {
  static navigationOptions = { header: null };

  state = { email: "", password: "", errorMessage: null };

  handleLogin = () => {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate("Home"))
      .catch(error => this.setState({ errorMessage: error.message }));
    this.props.userContext.setUser(this.state);
  };

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

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
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <View style={styles.buttonContainer}>
          <AwesomeButton
            backgroundColor={"#edeeef"}
            textColor={"#8A54A2"}
            width={100}
            onPress={this.handleLogin}
          >
            Login
          </AwesomeButton>
        </View>
        <View style={styles.bottomLink}>
          <Button
            title="Don't have an account? Sign Up"
            color="#edeeef"
            onPress={() => this.props.navigation.navigate("SignUp")}
          />
        </View>
      </View>
    );
  }
}

export default withUser(Login);
