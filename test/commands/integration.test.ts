import { expect, test } from "@oclif/test"

describe("integration", () => {
  test
    .stdout()
    .command(["integration"])
    .exit(0)
    .it("runs integration info message", ctx => {
      console.log("hello world");
      expect(ctx.stdout).to.contain("integration:new");
    })
});


