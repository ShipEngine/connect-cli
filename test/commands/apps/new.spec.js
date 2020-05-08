"use strict";

const { expect, test } = require("@oclif/test");

describe("apps:new", () => {
  test
    .stdout()
    .command(["apps:new"])
    .exit(0)
    .it("runs app info message", (ctx) => {
      expect(ctx.stdout).to.contain("apps:new");
    });
});
