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
    return (
      <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
        <Text style={{ color: "#8A54A2", fontSize: 24, fontWeight: "700" }}>
          Featured: Location D
        </Text>
        <Text style={{ fontWeight: "100", marginTop: 10 }}>
          A new selection of workspaces verified for quality & comfort
        </Text>
        <View style={{ width: width - 40, height: 200, marginTop: 20 }}>
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
