import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Platform,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  Button,
  TouchableOpacity
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import FavouritesCarousel from "./FavouritesCarousel";
import firebase from "firebase";

const { height, width } = Dimensions.get("window");

class ActiveCodeHome extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection("locations");
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      locations: []
    };
  }
  componentWillMount() {
    this.startHeaderHeight = 80;
    if (Platform.OS == "android") {
      this.startHeaderHeight = 100 + StatusBar.currentHeight;
    }
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  onCollectionUpdate = querySnapshot => {
    const locations = [];
    querySnapshot.forEach(doc => {
      const { title, description, image, coordinate } = doc.data();
      locations.push({
        key: doc.id,
        title,
        description,
        image,
        coordinate
      });
    });
    this.setState({
      locations,
      isLoading: false
    });
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View>
            <Button
              onPress={this._removeCode}
              title="Remove code"
              color="#FF0000"
            />
            <Text>Cardiff Library</Text>
            <Button
              onPress={this._feedback}
              title="Feedback"
            />
          </View>
          <View>
            <Text>Code</Text>
            <Text>Valid for: 24 hours</Text>
            <Button
              onPress={this._howTo}
              title="How do I use this code?"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
export default ActiveCodeHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
