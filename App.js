import React from "react";
import axios from "axios";
import { Button, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator
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
import Pay from "./src/components/Payment/Pay";
import LocationMap from "./src/components/Maps/LocationMap";
import LocationDetailScreen from "./src/components/Locations/LocationDetailScreen";
import ActiveCodeHome from "./src/components/Home/ActiveCodeHome";
import DefaultHome from "./src/components/Home/DefaultHome";
import Home from "./src/components/Home/Home";

import LandingPage from "./src/components/Auth/LandingPage";

setupFirebase();
axios.defaults.baseURL = "http://10.164.76.149:4000";

const HomeStack = createStackNavigator(
  {
    Home: Home,
    ActiveCodeHome: ActiveCodeHome,
    DefaultHome: DefaultHome,
    Board: BoardScreen,
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
    Settings: Settings,
    Pay: Pay
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

const AppStack = createBottomTabNavigator(
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

const AuthStack = createStackNavigator({
  Loading: Loading,
  LandingPage: LandingPage,
  Login: Login,
  SignUp: SignUp
});

const RootStack = createSwitchNavigator({
  Auth: AuthStack,
  App: AppStack
});

export default createAppContainer(RootStack);
