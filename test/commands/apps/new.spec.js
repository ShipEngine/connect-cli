"use strict";

const { expect, test } = require("@oclif/test");
const sinon = require("sinon");
const yeomanEnv = require("yeoman-environment");

describe("apps:new", () => {
  beforeEach(() => {
    sinon.stub(yeomanEnv, "createEnv").returns({
      run: (namespace, options, callback) => {
        callback();
      },
      register: () => {},
    });
  });

  test
    .stdout()
    .command(["apps:new"])
    .it("scaffolds a new app", (ctx) => {
      expect(ctx.stdout).to.contain("Time to build a ShipEngine app!\n");
    });

  afterEach(() => {
    sinon.restore();
  });
});
