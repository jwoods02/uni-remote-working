import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  Button
} from "react-native";

const { width } = Dimensions.get("window");
import moment from "moment";

export default class SessionListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      location: {},
      active: false
    };
  }

  async componentDidMount() {
    const doc = await this.props.session.data().access_code.location.get();

    if (doc.exists) {
      console.log("doc exists");

      if (doc.data().end === null) {
        console.log("END IS NULL");
        this.setState({
          location: doc.data(),
          active: true,
          isLoading: false
        });
      } else {
        console.log("END IS NOT NULL");

        const duration = moment
          .duration(
            moment
              .unix(this.props.session.data().end.seconds)
              .diff(moment.unix(this.props.session.data().start.seconds))
          )
          .humanize();
        this.setState({
          location: doc.data(),
          active: false,
          isLoading: false,
          duration
        });
      }
    } else {
      console.log("No such document!");
    }
  }

  render() {
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
          {this.state.active && (
            <Text style={{ fontWeight: "100", marginTop: 10 }}>
              Code still active!
            </Text>
          )}
          {!this.state.active && (
            <View>
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
                Duration: {this.state.duration}
              </Text>
            </View>
          )}
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
