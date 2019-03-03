//This is an example code for Bottom Navigation//
import React from "react";
//import react in our code.

import { Button, Text, View, TouchableOpacity, StyleSheet } from "react-native";
//import all the basic component we have used

import { Ionicons } from "react-native-vector-icons";
//import Ionicons to show the icon for bottom options

//For React Navigation 2.+ import following
//import {createStackNavigator,createBottomTabNavigator} from 'react-navigation';

//For React Navigation 3.+ import following
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from "react-navigation";
//import createStackNavigator, createBottomTabNavigator, createAppContainer in our project

import BoardScreen from "./src/components/CRUD/BoardScreen";
import BoardDetailScreen from "./src/components/CRUD/BoardDetailScreen";
import AddBoardScreen from "./src/components/CRUD/AddBoardScreen";
import EditBoardScreen from "./src/components/CRUD/EditBoardScreen";
import Loading from "./src/components/Auth/Loading";
import SignUp from "./src/components/Auth/SignUp";
import Login from "./src/components/Auth/Login";
import Main from "./src/components/Auth/Main";
import Settings from "./src/components/User/Settings";

import setupFirebase from "./Firebase";
import LocationMap from "./src/components/Maps/LocationMap";
import LocationDetailScreen from "./src/components/Locations/LocationDetailScreen";
import Home from "./src/components/Home/Home";

setupFirebase();

const HomeStack = createStackNavigator(
  {
    Home: Home,
    Baord: BoardScreen,
    BoardDetails: BoardDetailScreen,
    AddBoard: AddBoardScreen,
    EditBoard: EditBoardScreen,
    Main: Main,
    Loading: Loading,
    SignUp: SignUp,
    Login: Login,
    LocationMap: LocationMap,
    LocationDetailScreen: LocationDetailScreen
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "rgba(130,4,150, 0.4)"
      },
      headerTintColor: "#FFFFFF",
      title: "Home"
    }
  }
);

const MapStack = createStackNavigator(
  {
    LocationMap: LocationMap,
    // Home: Home,
    Board: BoardScreen,
    BoardDetails: BoardDetailScreen,
    AddBoard: AddBoardScreen,
    EditBoard: EditBoardScreen,
    Main: Main,
    Loading: Loading,
    SignUp: SignUp,
    Login: Login,
    LocationDetailScreen: LocationDetailScreen
    // Settings: Settings
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "rgba(130,4,150, 0.4)"
      },
      headerTintColor: "#FFFFFF",
      title: "Locations Near You"
    }
  }
);

const SettingsStack = createStackNavigator(
  {
    //Defination of Navigaton from home screen
    Settings: Settings
    // Loading: Loading,
    // SignUp: SignUp,
    // Login: Login
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "rgba(130,4,150, 0.4)"
      },
      headerTintColor: "#FFFFFF",
      title: "Account"
      //Header title
    }
  }
);

const App = createBottomTabNavigator(
  {
    //Defination of Navigaton bottom options
    Home: { screen: HomeStack },
    Map: { screen: MapStack },
    Settings: { screen: SettingsStack }
  },
  {
    //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === "Home") {
          iconName = `ios-home`;
          // Sometimes we want to add badges to some icons.
          // You can check the implementation below.
        } else if (routeName === "Settings") {
          iconName = `ios-person`;
        } else if (routeName === "Map") {
          iconName = `md-map`;
        }
        // You can return any component that you like here!
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      }
    }),
    tabBarOptions: {
      activeTintColor: "rgba(130,4,150, 0.7)",
      inactiveTintColor: "gray"
    }
  }
);

export default createAppContainer(App);
