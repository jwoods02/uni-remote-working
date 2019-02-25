import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default class ScrollViewItems extends Component {
  render() {
    return this.props.markers.map((marker, index) => (
      <View style={styles.card} key={index}>
        <Image
          source={{ uri: marker.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.textContent}>
          <Text numberOfLines={1} style={styles.cardtitle}>
            {marker.title}
          </Text>
          <Text numberOfLines={1} style={styles.cardDescription}>
            {marker.description}
          </Text>
        </View>
      </View>
    ));
  }
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    elevation: 2,
    left: 100,
    backgroundColor: "#FFF",
    opacity: 0.85,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.9,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden"
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center"
  },
  textContent: {
    flex: 1
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold"
  },
  cardDescription: {
    fontSize: 12,
    color: "#444"
  }
});

// AppRegistry.registerComponent("LocationMap", () => LocationMap);
