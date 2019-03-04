import React, { Component } from "react";
import {
  WebView,
  Platform,
  View,
  ViewPropTypes,
  StyleSheet,
  Dimensions
} from "react-native";
import { PropTypes } from "prop-types";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

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
      style,
      onPaymentSuccess,
      onClose
    } = this.props;

    const jsCode = `(function() {
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
          injectedJavaScript={jsCode}
          originWhitelist={["*"]}
          onMessage={event => {
            return event.nativeEvent.data === "WINDOW_CLOSED"
              ? onClose()
              : onPaymentSuccess(event.nativeEvent.data);
          }}
          // source={{
          //   html: `<form action="http://192.168.1.231:4000/api/pay/token" method="POST">
          //         <script
          //             src="https://checkout.stripe.com/checkout.js"
          //             class="stripe-button"
          //             data-key="pk_test_bvxdsrvMxXGmtHi3UEDMw759"
          //             data-amount="999"
          //             data-name="Remote Working"
          //             data-description="Widget"
          //             data-image="https://stripe.com/img/documentation/checkout/marketplace.png"
          //             data-locale="auto"
          //             data-currency="gbp"
          //         ></script>
          //         </form>
          //         `
          // }}
          source={{
            html: `<script src="https://checkout.stripe.com/checkout.js"></script>
            <script>
            var handler = StripeCheckout.configure({
              key: '${publicKey}',
              image: '${imageUrl}',
              locale: 'auto',
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
          // scalesPageToFit={Platform.OS === "android"}
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
