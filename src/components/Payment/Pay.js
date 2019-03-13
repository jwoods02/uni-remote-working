import React, { Component } from "react";
import StripeCheckout from "./StripeCheckout";
import axios from "axios";
import firebase from "firebase";

export default class Pay extends Component {
  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const email = navigation.getParam("email", "");

    this.state = { email };
  }

  onPaymentSuccess = async token => {
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

    this.props.navigation.navigate("Home");
  };

  onClose = () => {
    this.props.navigation.goBack();
  };
  render() {
    return (
      <StripeCheckout
        publicKey="pk_test_bvxdsrvMxXGmtHi3UEDMw759"
        amount={100000}
        imageUrl="https://pbs.twimg.com/profile_images/778378996580888577/MFKh-pNn_400x400.jpg"
        storeName="Stripe Checkout"
        description="Test"
        currency="GBP"
        allowRememberMe={false}
        prepopulatedEmail={this.state.email}
        onClose={this.onClose}
        onPaymentSuccess={this.onPaymentSuccess}
      />
    );
  }
}
