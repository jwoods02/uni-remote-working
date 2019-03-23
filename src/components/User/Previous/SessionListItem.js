import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Dimensions
} from "react-native";

const { width } = Dimensions.get("window");

export default class SessionListItem extends Component {
  render() {
    // console.log("PROPS SECONDS", this.props.session.data().start.seconds);
    return (
      <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
        <Text style={{ color: "#8A54A2", fontSize: 24, fontWeight: "700" }}>
          {/* {this.props.session.data().start} */}
        </Text>
        <Text style={{ fontWeight: "100", marginTop: 10 }}>
          A new selection of workspaces verified for quality & comfort
        </Text>
        <Text style={{ fontWeight: "100", marginTop: 10 }}>
          Requested:
          {" " +
            new Date(
              this.props.session.data().access_code.requested.seconds * 1000
            ).toLocaleTimeString("en-US") +
            " on " +
            new Date(
              this.props.session.data().access_code.requested.seconds * 1000
            ).toLocaleDateString("en-UK")}
        </Text>
        <Text style={{ fontWeight: "100", marginTop: 10 }}>
          Session Start:
          {" " +
            new Date(
              this.props.session.data().start.seconds * 1000
            ).toLocaleTimeString("en-US") +
            " on " +
            new Date(
              this.props.session.data().start.seconds * 1000
            ).toLocaleDateString("en-UK")}{" "}
        </Text>
        <Text style={{ fontWeight: "100", marginTop: 10 }}>
          Session End:
          {" " +
            new Date(
              this.props.session.data().start.end * 1000
            ).toLocaleTimeString("en-US") +
            " on " +
            new Date(
              this.props.session.data().start.end * 1000
            ).toLocaleDateString("en-UK")}{" "}
        </Text>
        <Text style={{ fontWeight: "100", marginTop: 10 }}>
          A new selection of workspaces verified for quality & comfort A new
          selection of workspaces verified for quality & comfort
        </Text>
        <View style={{ width: width - 40, height: 100, marginTop: 20 }}>
          <Image
            style={{
              flex: 1,
              height: null,
              width: null,
              resizeMode: "cover",
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#dddddd"
            }}
            source={require("../../../../assets/locationD.jpg")}
          />
        </View>
      </View>
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
