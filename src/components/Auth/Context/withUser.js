import * as React from "react";
import { UserContext } from "./user-context";
export function withUser(Component) {
  return function UserComponent(props) {
    return (
      <UserContext.Consumer>
        {contexts => <Component {...props} {...contexts} />}
      </UserContext.Consumer>
    );
  };
}
