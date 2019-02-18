import React from "react";

import { StyleSheet, Platform, Image, Text, View } from "react-native";

// import the different screens

// import { StyleSheet, Text, View } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import BoardScreen from "./components/CRUD/BoardScreen";
import BoardDetailScreen from "./components/CRUD/BoardDetailScreen";
import AddBoardScreen from "./components/CRUD/AddBoardScreen";
import EditBoardScreen from "./components/CRUD/EditBoardScreen";
import Loading from "./components/Auth/Loading";
import SignUp from "./components/Auth/SignUp";
import Login from "./components/Auth/Login";
import Main from "./components/Auth/Main";

const Tab = createBottomTabNavigator({
  Home: {
    screen: BoardScreen
  }
});
// const RootStack = createStackNavigator({
//   Home1: {
//     screen: Tab
//   }
// });

const RootStack = createStackNavigator(
  {
    Board: BoardScreen,
    BoardDetails: BoardDetailScreen,
    AddBoard: AddBoardScreen,
    EditBoard: EditBoardScreen,
    Main: Main,
    Loading: Loading,
    SignUp: SignUp,
    Login: Login
  },
  {
    initialRouteName: "Loading",
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#777777"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      },
      headerBackTitle: null
    }
  },
  {
    screen: Tab
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
