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

const { width } = Dimensions.get("window");

export default class DefaultHome extends Component {
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
    this.ref.onSnapshot(this.onCollectionUpdate);
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
          <View
            style={{
              height: this.startHeaderHeight,
              backgroundColor: "white",
              borderBottomWidth: 1,
              borderBottomColor: "#dddddd",
              paddingTop: 20
            }}
          >
            <View
              style={{
                flexDirection: "row",
                padding: 10,
                backgroundColor: "white",
                marginHorizontal: 20,
                shadowOffset: { width: 0, height: 0 },
                shadowColor: "black",
                shadowOpacity: 0.2,
                elevation: 1,
                marginTop: Platform.OS == "android" ? 30 : null
              }}
            >
              <Icon name="ios-search" size={20} style={{ marginRight: 10 }} />
              <TextInput
                underlineColorAndroid="transparent"
                placeholder="Search Locations"
                placeholderTextColor="grey"
                style={{ flex: 1, fontWeight: "700", backgroundColor: "white" }}
              />
            </View>
          </View>
          <ScrollView scrollEventThrottle={16}>
            <View style={{ flex: 1, backgroundColor: "white", paddingTop: 20 }}>
              <Text
                style={{
                  color: "#8A54A2",
                  fontSize: 24,
                  fontWeight: "700",
                  paddingHorizontal: 20
                }}
              >
                Some of your favourites...
              </Text>

              <View style={{ height: 140, marginTop: 10 }}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {this.state.locations.map((location, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        this.props.navigation.navigate("LocationDetailScreen", {
                          locationkey: `${JSON.stringify(location.key)}`
                        });
                      }}
                    >
                      <FavouritesCarousel
                        key={i}
                        imageUri={{ uri: location.image }}
                        name={location.title}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
                <Text
                  style={{ color: "#8A54A2", fontSize: 24, fontWeight: "700" }}
                >
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
            </View>
            <Button
              style={{ top: 50, left: 0, right: 0, bottom: 0 }}
              title="View All Locations"
              onPress={() => this.props.navigation.navigate("LocationMap")}
            />

            <Button
              title="Update User context"
              onPress={() => this.props.userContext.setUser("red")}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
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
