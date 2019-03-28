import React from "react";
import "react-native";
import renderer from "react-test-renderer";

import Login from "./Login";

describe("<Login>", () => {
  it("renders login", () => {
    const inst = renderer.create(<Login />);
    const root = inst.root;
    expect(root.findByType(Login)).toBeTruthy();
  });
});
