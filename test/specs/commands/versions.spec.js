"use strict";

const { expect, test } = require("@oclif/test");

describe("connect versions", () => {
  test
    .stdout()
    .command(["versions"])
    .it("prints versions", (ctx) => {
      expect(ctx.stdout).to.contain("testint 1, 2, 3\n");
    });
});
