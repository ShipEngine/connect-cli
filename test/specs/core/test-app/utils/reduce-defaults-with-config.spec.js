"use strict";

const { expect } = require("chai");
const reduceDefaultsWithConfig = require("../../../../../lib/core/test-app/utils/reduce-defaults-with-config")
  .default;

describe("reduceDefaultsWithConfig", () => {
  it("returns merges the two objects and gives presedence to key/values in the configObject", () => {
    const defaultObject = {
      foo: "bar",
      baz: "bat",
    };

    const configObject = {
      baz: "test",
    };

    expect(reduceDefaultsWithConfig(defaultObject, configObject)).to.eql({
      foo: "bar",
      baz: "test",
    });
  });
});
