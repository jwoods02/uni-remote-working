import * as React from "react";
import { UserContext } from "./theme-context";
export default class UserProvider extends React.Component {
  constructor() {
    super();
    this.state = {
      setColor: this.setColor.bind(this),
      color: "yellow"
    };
  }
  setColor(color) {
    this.setState({ color });
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
