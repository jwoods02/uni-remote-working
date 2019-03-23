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
  constructor() {
    super();
    this.data = [
      { time: "09:00", title: "Event 1", description: "Event 1 Description" },
      { time: "10:45", title: "Event 2", description: "Event 2 Description" },
      { time: "12:00", title: "Event 3", description: "Event 3 Description" },
      { time: "14:00", title: "Event 4", description: "Event 4 Description" },
      { time: "16:30", title: "Event 5", description: "Event 5 Description" }
    ];
  }
  render() {
    return (
      <View style={styles.container}>
        <Timeline style={styles.list} data={this.data} />
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
