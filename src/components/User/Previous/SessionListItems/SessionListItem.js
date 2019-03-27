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
import SessionTimeline from "./SessionTimeline";

export default class SessionListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      location: {},
      active: true
    };
  }

  async componentDidMount() {
    const locationDoc = await this.props.session
      .data()
      .access_code.location.get(); //GETTING LOCATION NOT SESSION

    if (locationDoc.exists) {
      console.log("location Doc exists");
      console.log("Session prop end value: ", this.props.session.data().end);

      if (this.props.session.data().end == null) {
        console.log("SESSION END IS NULL");
        this.setState({
          location: locationDoc.data(),
          active: true,
          isLoading: false,
          active: true
        });
      } else {
        console.log("SESSION END IS NOT NULL");

        const duration = moment
          .duration(
            moment
              .unix(this.props.session.data().end.seconds)
              .diff(moment.unix(this.props.session.data().start.seconds))
          )
          .humanize();
        this.setState({
          location: locationDoc.data(),
          active: false,
          isLoading: false,
          duration
        });
      }
    } else {
      console.log("No such location Doc!");
    }
  }

  render() {
    var sessionDetails;
    if (this.state.active) {
      sessionDetails = (
        <Text style={{ fontWeight: "300", marginTop: 10 }}>
          Code still active!
        </Text>
      );
    } else {
      sessionDetails = (
        <View>
          <SessionTimeline session={this.props.session} />

          <Text
            style={{
              color: "grey",
              fontSize: 14,
              fontWeight: "300",
              marginTop: 10
            }}
          >
            Duration: {this.state.duration}
          </Text>
        </View>
      );
    }
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <Text>Loading</Text>
          <ActivityIndicator size="large" color="rgba(130,4,150, 0.4)" />
        </View>
      );
    } else {
      return (
        <View
          style={{ marginTop: 10, paddingHorizontal: 20, paddingBottom: 30 }}
        >
          <Text style={{ color: "#8A54A2", fontSize: 24, fontWeight: "700" }}>
            {this.state.location.title}
          </Text>
          <Text style={{ color: "grey", fontSize: 14, fontWeight: "300" }}>
            {new Date(
              this.props.session.data().access_code.requested
            ).toLocaleDateString("en-UK")}
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
          {sessionDetails}
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
