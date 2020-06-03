"use strict";

const { expect } = require("chai");
const Test = require("../../../../../lib/shipengine-core/test-app/tiny-test/test")
  .default;

const subject = new Test({ title: "test subject", fn: () => {} });

describe("Test", () => {
  describe(".toString", () => {
    it("returns a formatted string that includes the sha and title", () => {
      expect(subject.toString()).to.be.a("string");
      expect(subject.toString()).to.be.include(subject.title);
      expect(subject.toString()).to.be.include(subject.truncatedSha());
    });
  });
});
