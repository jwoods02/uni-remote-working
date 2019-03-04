// import React, { Component } from "react";
// import {
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   View,
//   Dimensions,
//   Image
// } from "react-native";
// import { List, ListItem, Text, Card, Button } from "react-native-elements";
// import firebase from "firebase";

// const { height, width } = Dimensions.get("window");

// class LocationDetailScreen extends Component {
//   static navigationOptions = {
//     title: "Edit Board"
//   };

//   constructor() {
//     super();
//     this.state = {
//       isLoading: true,
//       location: {},
//       key: ""
//     };
//   }
//   componentDidMount() {
//     const { navigation } = this.props;
//     const ref = firebase
//       .firestore()
//       .collection("locations")
//       .doc(JSON.parse(navigation.getParam("locationkey")));
//     ref.get().then(doc => {
//       if (doc.exists) {
//         this.setState({
//           location: doc.data(),
//           key: doc.id,
//           isLoading: false
//         });
//       } else {
//         console.log("No such document!");
//       }
//     });
//   }

//   render() {
//     if (this.state.isLoading) {
//       return (
//         <View style={styles.activity}>
//           <ActivityIndicator size="large" color="#0000ff" />
//         </View>
//       );
//     }
//     return (
//       <ScrollView>
//         <Card style={styles.container}>
//           <View style={styles.subContainer}>
//             <View>
//               <Text h3>{this.state.location.title}</Text>
//             </View>
//             <View>
//               <Text h5>{this.state.location.description}</Text>
//             </View>
//             <View>
//               <Text h4>{this.state.location.image}</Text>
//             </View>
//             <Button title="Request Code" type="outline" />
//           </View>

//           <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
//             <Text style={{ fontSize: 24, fontWeight: "700" }}>
//               Featured: Location D
//             </Text>
//             <Text style={{ fontWeight: "100", marginTop: 10 }}>
//               A new selection of workspaces verified for quality & comfort
//             </Text>
//             <View style={{ width: width - 40, height: 200, marginTop: 20 }}>
//               <Image
//                 style={{
//                   flex: 1,
//                   height: null,
//                   width: null,
//                   resizeMode: "cover",
//                   borderRadius: 5,
//                   borderWidth: 1,
//                   borderColor: "#dddddd"
//                 }}
//                 source={require("../../../assets/locationD.jpg")}
//               />
//             </View>
//           </View>
//         </Card>
//       </ScrollView>
//     );
//   }
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20
//   },
//   subContainer: {
//     flex: 1,
//     paddingBottom: 20,
//     borderBottomWidth: 2,
//     borderBottomColor: "#CCCCCC"
//   },
//   activity: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//     alignItems: "center",
//     justifyContent: "center"
//   },
//   detailButton: {
//     marginTop: 10
//   }
// });

// export default LocationDetailScreen;

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
import Icon from "react-native-vector-icons/Ionicons";

import firebase from "firebase";

const { height, width } = Dimensions.get("window");

class LocationDetailScreen extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      location: {},
      key: ""
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
export default LocationDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
