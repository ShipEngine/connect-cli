"use strict";

const { expect, test } = require("@oclif/test");

describe("apps:new", () => {
  test
    .stdout()
    .command(["apps:new"])
    .it("scaffolds a new app", (ctx) => {
      expect(ctx.stdout).to.contain("apps:new");
    });
});
