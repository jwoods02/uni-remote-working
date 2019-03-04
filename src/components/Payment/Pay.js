import React, { Component } from "react";
import StripeCheckout from "./StripeCheckout";
import axios from "axios";

export default class Pay extends Component {
  onPaymentSuccess = token => {
    // send the stripe token to your backend!
    console.log(token);
    axios
      .post("/api/pay/token", {
        token
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .then(function() {
        // always executed
        console.log("At least one thing happened");
      });
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
        prepopulatedEmail="test@test.com"
        onClose={this.onClose}
        onPaymentSuccess={this.onPaymentSuccess}
      />
    );
  }
}
