import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";

import {
  createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator,
  createBottomTabNavigator,
  createStackNavigator
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

setupFirebase();

class App extends Component {
  render() {
    return <AppContainer />;
  }
}
export default App;

class WelcomeScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          title="Login"
          onPress={() => this.props.navigation.navigate("Dashboard")}
        />
        <Button title="Sign Up" onPress={() => alert("button pressed")} />
      </View>
    );
  }
}

const DashboardTabNavigator = createBottomTabNavigator(
  {
    BoardScreen,
    LocationMap,
    Settings
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return {
        headerTitle: routeName,
        headerTitleStyle: {
          // fontWeight: "bold"
        },
        headerBackTitle: null
      };
    }
  }
);
const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator: DashboardTabNavigator
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerLeft: (
          <Icon
            style={{ paddingLeft: 10 }}
            onPress={() => navigation.goBack()}
            name="md-menu"
            size={30}
          />
        )
      };
    }
  }
);

const AppDrawerNavigator = createDrawerNavigator({
  Dashboard: {
    screen: DashboardStackNavigator
  }
});

const AppSwitchNavigator = createSwitchNavigator({
  SignUp: SignUp,
  Dashboard: AppDrawerNavigator,
  Board: BoardScreen,
  BoardDetails: BoardDetailScreen,
  AddBoard: AddBoardScreen,
  EditBoard: EditBoardScreen,
  Main: Main,
  Loading: Loading,
  // SignUp: SignUp,
  Login: Login,
  LocationMap: LocationMap,
  LocationDetailScreen: LocationDetailScreen
});

const AppContainer = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
