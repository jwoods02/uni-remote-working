import React from "react";
import "react-native";
import renderer from "react-test-renderer";

import Steps from "./Steps";

describe("<Steps>", () => {
  it("renders steps", () => {
    const navigation = {
      state: {
        params: {
          reset: false
        }
      },
      getParam(param, fun) {
        return this.state.params[param];
      }
    };
    const inst = renderer.create(<Steps navigation={navigation} />);
    const root = inst.root;
    expect(root.findByType(Steps)).toBeTruthy();
  });
});
