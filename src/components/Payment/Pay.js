import React, { Component } from "react";
import StripeCheckout from "./StripeCheckout";
import axios from "axios";
import firebase from "firebase";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

export default class Pay extends Component {
  static navigationOptions = { headerLeft: null };

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const email = navigation.getParam("email", "");

    this.state = { email, isLoading: false };
  }

  onPaymentSuccess = async token => {
    this.setState({ isLoading: true });

    try {
      const newCustomer = await axios.post("/api/pay/customer", {
        token,
        email: this.state.email
      });

      await axios.post("api/pay/subscription", {
        customer: newCustomer.data.id
      });

      const querySnapshot = await firebase
        .firestore()
        .collection("users")
        .where("email", "==", this.state.email)
        .get();

      querySnapshot.forEach(doc => {
        firebase
          .firestore()
          .collection("users")
          .doc(doc.id)
          .update({ stripe_customer: newCustomer.data.id });
      });
    } catch (err) {
      console.log(err);
    }

    this.props.navigation.navigate("Steps", { page: 2 });
  };

  onClose = () => {};
  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <Text>Setting up your account...</Text>
          <ActivityIndicator size="large" color="rgba(130,4,150, 0.4)" />
        </View>
      );
    }
    return (
      <StripeCheckout
        publicKey="pk_test_bvxdsrvMxXGmtHi3UEDMw759"
        amount={2000}
        imageUrl="https://pbs.twimg.com/profile_images/778378996580888577/MFKh-pNn_400x400.jpg"
        storeName="Stripe Checkout"
        description="Pay subscription"
        currency="GBP"
        allowRememberMe={false}
        prepopulatedEmail={this.state.email}
        onClose={this.onClose}
        onPaymentSuccess={this.onPaymentSuccess}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
