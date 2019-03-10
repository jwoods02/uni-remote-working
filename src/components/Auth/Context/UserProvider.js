import * as React from "react";
import { UserContext } from "./user-context";
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
