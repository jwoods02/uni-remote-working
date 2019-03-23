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
import Timeline from "react-native-timeline-listview";

const { width } = Dimensions.get("window");
import moment from "moment";

export default class SessionTimeline extends Component {
  constructor(props) {
    super(props);
    this.data = [];
    this.data.push(
      {
        time: new Date(
          this.props.session.data().access_code.requested.seconds * 1000
        ).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }),
        title: "Code Requested",
        description: "You requested a code for this venue"
      },
      {
        time: new Date(
          this.props.session.data().start.seconds * 1000
        ).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }),
        title: "Session Start",
        description: "You entered the code and the session started"
      },
      {
        time: new Date(
          this.props.session.data().end.seconds * 1000
        ).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }),
        title: "Session End",
        description: "You ended the session"
      }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Timeline
          style={styles.list}
          data={this.data}
          circleColor="grey"
          lineColor="grey"
          timeStyle={{ color: "purple" }}
          descriptionStyle={{ color: "grey" }}
          titleStyle={{ color: "rgba(130,4,150, 0.7)" }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 10,
    backgroundColor: "white"
  },
  list: {
    flex: 1,
    marginTop: 10
  }
});
