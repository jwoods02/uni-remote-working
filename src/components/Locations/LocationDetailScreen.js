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
  Alert
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { withUser } from "../Auth/Context/withUser";

import firebase from "firebase";

const { height, width } = Dimensions.get("window");

class LocationDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection("sessions");
    this.userRef = firebase
      .firestore()
      .collection("users")
      .where("auth", "==", this.props.userContext.user);
    this.state = {
      isLoading: true,
      location: {},
      key: "",
      user: ""
    };
  }

  componentWillMount() {
    this.startHeaderHeight = 80;
    if (Platform.OS == "android") {
      this.startHeaderHeight = 100 + StatusBar.currentHeight;
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    const ref = firebase
      .firestore()
      .collection("locations")
      .doc(JSON.parse(navigation.getParam("locationkey")));
    ref.get().then(doc => {
      if (doc.exists) {
        this.setState({
          location: doc.data(),
          key: doc.id,
          isLoading: false
        });
      } else {
        console.log("No such document!");
      }
    });
  }

  async handleRequestCode() {
    const { navigation } = this.props;

    const querySnapshot = await this.userRef.get();

    querySnapshot.forEach(doc => {
      this.setState({
        user: doc.id
      });
    });
    console.log(this.state.user);

    let userDocRef = firebase
      .firestore()
      .collection("users")
      .doc(this.state.user);

    let locationRef = firebase
      .firestore()
      .collection("locations")
      .doc(JSON.parse(navigation.getParam("locationkey")));

    this.ref
      .add({
        access_code: {
          code: 1234,
          requested: firebase.firestore.FieldValue.serverTimestamp(),
          expiry: null,
          location: locationRef
        },
        user: userDocRef,
        start: null,
        end: null,
        minutes: null
      })

      .catch(error => {
        console.error("Error adding document: ", error);
      });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView scrollEventThrottle={16}>
            <View style={{ flex: 1, backgroundColor: "white", paddingTop: 20 }}>
              <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: "700" }}>
                  {this.state.location.title}
                </Text>
                <Text style={{ fontWeight: "100", marginTop: 10 }}>
                  {this.state.location.description}
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
                    source={{ uri: this.state.location.image }}
                  />
                  <Button
                    onPress={() => {
                      this.handleRequestCode();
                      Alert.alert("Code Granted: 1234");
                    }}
                    title="Request Code"
                    type="outline"
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
export default withUser(LocationDetailScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
