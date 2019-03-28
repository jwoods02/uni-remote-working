import React from "react";
import "react-native";
import renderer from "react-test-renderer";

import SignUp from "./SignUp";

describe("<SignUp>", () => {
  it("renders sign up", () => {
    const inst = renderer.create(<SignUp />);
    const root = inst.root;
    expect(root.findByType(SignUp)).toBeTruthy();
  });
});
