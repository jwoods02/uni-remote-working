import * as React from "react";
import { UserContext } from "./user-context";
import firebase from "firebase";

export default class UserProvider extends React.Component {
  constructor() {
    super();
    this.state = {
      setUser: this.setUser.bind(this),
      user: "yellow"
    };
  }
  setUser(user) {
    this.setState({ user });
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user =>
      this.setState({
        user: firebase.auth().currentUser.uid
      })
    );
  }
  render() {
    return (
      <UserContext.Provider
        value={{
          userContext: {
            ...this.state
          }
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
