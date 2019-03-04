import React, { Component } from "react";
import StripeCheckout from "./StripeCheckout";
import axios from "axios";

const email = "new2@gmail.com";

export default class Pay extends Component {
  onPaymentSuccess = async token => {
    // send the stripe token to your backend!
    console.log(token);
    const newCustomer = await axios.post("/api/pay/customer", {
      token,
      email
    });
    console.log("CUSTOMER ID:", newCustomer.data.id);

    const newSubscription = await axios.post("api/pay/subscription", {
      customer: newCustomer.data.id
    });

    console.log("Subscription:", newSubscription.data.id);

    this.props.navigation.navigate("Board");
  };

  onClose = () => {
    console.log("LOGGED");
    // maybe navigate to other screen here?
    this.props.navigation.navigate("Board");
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
        prepopulatedEmail={email}
        onClose={this.onClose}
        onPaymentSuccess={this.onPaymentSuccess}
      />
    );
  }
}
