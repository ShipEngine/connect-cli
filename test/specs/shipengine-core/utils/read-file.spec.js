"use strict";
const { expect } = require("chai");
const subject = require("../../../../lib/shipengine-core/utils/read-file");

describe("readFile", () => {
  // it("reads and imports a js file as a module", async () => {
  //   const response = await subject.readFile(
  //     "test/fixtures/files/read-commonjs-test.js",
  //   );
  //   expect(response.foo).equal("bar");
  // });

  it("reads and imports a json file as a module", async () => {
    const response = await subject.readFile(
      "test/fixtures/files/read-json-test.json",
    );
    expect(response.foo).equal("bar");
  });

  it("reads and imports a yaml file as a module", async () => {
    const response = await subject.readFile(
      "test/fixtures/files/read-yaml-test.yaml",
    );
    expect(response.foo).equal("bar");
  });

  it("reads and imports a yml file as a module", async () => {
    const response = await subject.readFile(
      "test/fixtures/files/read-yaml-test.yml",
    );
    expect(response.foo).equal("bar");
  });
});
