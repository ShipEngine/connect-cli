import { expect, test } from "@oclif/test";

describe("apps:test", () => {
  test
    .stdout()
    .command(["apps:new test-app -y"])
    .it("run the tests", (ctx) => {
      expect(ctx.stdout).to.contain("time to build");
    });
});
