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
import moment from "moment";

export default class SessionListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      location: {}
    };
  }

  async componentDidMount() {
    const doc = await this.props.session.data().access_code.location.get();

    if (doc.exists) {
      console.log("doc exists");
      this.setState({
        location: doc.data(),
        isLoading: false
      });
    } else {
      console.log("No such document!");
    }
  }

  render() {
    const duration = moment
      .duration(
        moment
          .unix(this.props.session.data().end.seconds)
          .diff(moment.unix(this.props.session.data().start.seconds))
      )
      .humanize();
    // console.log("PROPS SECONDS", this.props.session.data().start.seconds);
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <Text>Loading</Text>
          <ActivityIndicator size="large" color="rgba(130,4,150, 0.4)" />
        </View>
      );
    } else {
      return (
        <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
          <Text style={{ color: "#8A54A2", fontSize: 24, fontWeight: "700" }}>
            {this.state.location.title}
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
              source={{ uri: this.state.location.image }}
            />
          </View>

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
                this.props.session.data().end.seconds * 1000
              ).toLocaleTimeString("en-US") +
              " on " +
              new Date(
                this.props.session.data().end.seconds * 1000
              ).toLocaleDateString("en-UK")}{" "}
          </Text>
          <Text style={{ fontWeight: "100", marginTop: 10 }}>
            Duration: {duration}
            {/* {" " +
              new Date(
                this.props.session.data().end.seconds * 1000
              ).toLocaleTimeString("en-US") +
              " on " +
              new Date(
                this.props.session.data().end.seconds * 1000
              ).toLocaleDateString("en-UK")}{" "} */}
          </Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
