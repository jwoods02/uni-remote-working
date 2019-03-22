import React from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator
} from "react-navigation";

import Loading from "./src/components/Auth/Loading";
import SignUp from "./src/components/Auth/SignUp";
import Login from "./src/components/Auth/Login";
import Main from "./src/components/Auth/Main";
import Steps from "./src/components/Auth/Steps";
import Settings from "./src/components/User/Settings";

import setupFirebase from "./Firebase";
import Pay from "./src/components/Payment/Pay";
import LocationMap from "./src/components/Maps/LocationMap";
import LocationDetailScreen from "./src/components/Locations/LocationDetailScreen";
import ActiveCodeHome from "./src/components/Home/CodeRequested/ActiveCodeHome";
import DefaultHome from "./src/components/Home/Default/DefaultHome";
import Home from "./src/components/Home/Home";
import ActiveSession from "./src/components/Home/SessionActive/ActiveSession";

import LandingPage from "./src/components/Auth/LandingPage";
import UserProvider from "./src/components/Auth/Context/UserProvider";
import ManageSession from "./src/components/User/ManageSession";

setupFirebase();
axios.defaults.baseURL = "http://10.247.39.92:4000";

const HomeStack = createStackNavigator(
  {
    Home: Home,
    ActiveCodeHome: ActiveCodeHome,
    DefaultHome: DefaultHome,
    ActiveSession: ActiveSession,
    Main: Main,
    Loading: Loading,
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

    Main: Main,
    Loading: Loading,
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
    ManageSession: ManageSession
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
  Steps: Steps,
  Login: Login,
  SignUp: SignUp,
  Pay: Pay
});

const RootStack = createSwitchNavigator({
  Auth: AuthStack,
  App: AppStack
});

let AppContainer = createAppContainer(RootStack);
export default class App extends React.Component {
  render() {
    return (
      <UserProvider>
        <AppContainer />
      </UserProvider>
    );
  }
}
