"use strict";

const { expect, test } = require("@oclif/test");
const nock = require("nock");
const path = require("path");

let cwd;
describe.only("apps:publish", () => {

  test
    .stdout()
    .command(["apps:publish", "-h"])
    .exit(0)
    .it("calls the apps:publish -h command", (ctx) => {
      expect(ctx.stdout).to.contain("publish your app");
    });

  test
    .stdout()
    .command(["apps:publish", "--help"])
    .exit(0)
    .it("calls the apps:publish --help command", (ctx) => {
      expect(ctx.stdout).to.contain("publish your app");
    });

  test
    .nock("http://localhost:3000", (api) => {
      api.post(uri => uri.includes("deploy")).reply(200, { deployId: "12345" });
    })
    .do(() => {
      cwd = process.cwd();
      process.chdir(path.join(cwd, "test", "fixtures", "apps", "carrier", "valid"));
    })
    // .finally(() => {
    //   process.chdir(cwd);
    // })
    .stdout()
    .command(["apps:publish"])
    // .exit(0)
    .do(() => {
      process.chdir(cwd);
    })
    .it("calls the apps:publish command", (ctx) => {
      expect(ctx.stdout).to.contain("To track the status of the deployment");
    });
});
