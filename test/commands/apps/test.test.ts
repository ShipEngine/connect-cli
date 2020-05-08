import { expect, test } from "@oclif/test";

describe("apps:test", () => {
  test
    .stdout()
    .command(["apps:test"])
    .it("run the tests", (ctx) => {
      expect(ctx.stdout).to.contain("testing 1, 2, 3\n");
    });
});
