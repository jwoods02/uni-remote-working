import * as React from "react";
export const UserContext = React.createContext(
  // default values used by a Consumer when it does not have a
  // matching Provider above it in the tree, useful for testing
  {
    userContext: {
      user: null,
      setUser: () => {}
    }
  }
);
