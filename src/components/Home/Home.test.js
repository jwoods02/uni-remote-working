import React from "react";
import "react-native";
import renderer from "react-test-renderer";

import Home from "./Home";

describe("<Home>", () => {
  it("renders default home", () => {
    const inst = renderer.create(<Home />);
    const root = inst.root;
    expect(root.findByType(Home)).toBeTruthy();
  });
});
