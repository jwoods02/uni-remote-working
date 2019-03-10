import * as React from "react";
export const ThemeContext = React.createContext(
  // default values used by a Consumer when it does not have a
  // matching Provider above it in the tree, useful for testing
  {
    themeContext: {
      color: "blue",
      setColor: () => {}
    }
  }
);
