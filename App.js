import React from "react";
import axios from "axios";
import { StyleSheet, Platform, Image, Text, View } from "react-native";

// import the different screens

// import { StyleSheet, Text, View } from "react-native";
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator
} from "react-navigation";

import BoardScreen from "./src/components/CRUD/BoardScreen";
import BoardDetailScreen from "./src/components/CRUD/BoardDetailScreen";
import AddBoardScreen from "./src/components/CRUD/AddBoardScreen";
import EditBoardScreen from "./src/components/CRUD/EditBoardScreen";
import Loading from "./src/components/Auth/Loading";
import SignUp from "./src/components/Auth/SignUp";
import Login from "./src/components/Auth/Login";
import Main from "./src/components/Auth/Main";
import setupFirebase from "./Firebase";
import Payment from "./src/components/Payment/Payment";
import Pay from "./src/components/Payment/Pay";

const Tab = createBottomTabNavigator({
  Home: {
    screen: BoardScreen
  }
});

const RootStack = createStackNavigator(
  {
    Board: BoardScreen,
    BoardDetails: BoardDetailScreen,
    AddBoard: AddBoardScreen,
    EditBoard: EditBoardScreen,
    Main: Main,
    Loading: Loading,
    SignUp: SignUp,
    Login: Login,
    Payment: Pay
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
  }
);

axios.defaults.baseURL = "http://10.135.128.69:4000";
setupFirebase();

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
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
