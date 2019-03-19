import React from "react";
import "react-native";
import renderer from "react-test-renderer";

import Home from "./Home";
import DefaultHome from "./DefaultHome";

describe("<Home>", () => {
  it("renders default home", () => {
    const inst = renderer.create(<Home />);
    const root = inst.root;
    expect(root.findByType(DefaultHome)).toBeTruthy();
  });
});
