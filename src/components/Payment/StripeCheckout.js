// Adapted version of https://github.com/briansztamfater/expo-stripe-checkout
import React, { Component } from "react";
import {
  WebView,
  View,
  ViewPropTypes,
  StyleSheet,
  Dimensions
} from "react-native";
import { PropTypes } from "prop-types";

const width = Dimensions.get("window").width;

class StripeCheckout extends Component {
  render() {
    const {
      publicKey,
      amount,
      allowRememberMe,
      currency,
      description,
      imageUrl,
      storeName,
      prepopulatedEmail,
      onPaymentSuccess,
      onClose
    } = this.props;

    const fixPostMessage = `(function() {
                    var originalPostMessage = window.postMessage;

                    var patchedPostMessage = function(message, targetOrigin, transfer) {
                      originalPostMessage(message, targetOrigin, transfer);
                    };

                    patchedPostMessage.toString = function() {
                      return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
                    };

                    window.postMessage = patchedPostMessage;
                  })();`;
    return (
      <View style={styles.container}>
        <WebView
          javaScriptEnabled={true}
          scrollEnabled={false}
          bounces={false}
          useWebKit={true}
          injectedJavaScript={fixPostMessage}
          originWhitelist={["*"]}
          onMessage={event => {
            return event.nativeEvent.data === "WINDOW_CLOSED"
              ? onClose()
              : onPaymentSuccess(event.nativeEvent.data);
          }}
          source={{
            html: `<script src="https://checkout.stripe.com/checkout.js"></script>
            <script>
            var handler = StripeCheckout.configure({
              key: '${publicKey}',
              image: '${imageUrl}',
              locale: 'auto',
              panelLabel: 'Subscribe and pay {{amount}}',
              token: function(token) {
                window.postMessage(token.id);
              },
            });

            window.onload = function() {
              handler.open({
                name: '${storeName}',
                description: '${description}',
                amount: ${amount},
                currency: '${currency}',
                allowRememberMe: ${allowRememberMe},
                email: '${prepopulatedEmail}',
                closed: function() {
                  window.postMessage("WINDOW_CLOSED");
                }
              });
            };
            </script>`,
            baseUrl: ""
          }}
          style={styles.stripe}
        />
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
  stripe: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width * 2
  }
});

StripeCheckout.propTypes = {
  publicKey: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
  storeName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  allowRememberMe: PropTypes.bool.isRequired,
  onPaymentSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  currency: PropTypes.string,
  prepopulatedEmail: PropTypes.string,
  style: ViewPropTypes.style
};

StripeCheckout.defaultProps = {
  prepopulatedEmail: "",
  currency: "USD"
};

export default StripeCheckout;
