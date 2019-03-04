import React from "react";

import { Button, Text, View, TouchableOpacity, StyleSheet } from "react-native";

import { Ionicons } from "react-native-vector-icons";

import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from "react-navigation";

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
    Board: BoardScreen,
    BoardDetails: BoardDetailScreen,
    AddBoard: AddBoardScreen,
    EditBoard: EditBoardScreen,
    Main: Main,
    Loading: Loading,
    SignUp: SignUp,
    Login: Login,
    LocationDetailScreen: LocationDetailScreen
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
    Settings: Settings
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "rgba(130,4,150, 0.4)"
      },
      headerTintColor: "#FFFFFF",
      title: "Account"
    }
  }
);

const App = createBottomTabNavigator(
  {
    Home: { screen: HomeStack },
    Map: { screen: MapStack },
    Settings: { screen: SettingsStack }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === "Home") {
          iconName = `ios-home`;
        } else if (routeName === "Settings") {
          iconName = `ios-person`;
        } else if (routeName === "Map") {
          iconName = `md-map`;
        }
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
