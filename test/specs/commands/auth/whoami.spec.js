"use strict";

const { expect, test } = require("@oclif/test");
const ApiKeyStore = require("../../../../lib/core/api-key-store");

describe("whoami when autheticated", () => {
  beforeEach(() => {
    ApiKeyStore.clear();
    ApiKeyStore.set("test");
  });

  test
    .nock("https://dip-webapi-dev.kubedev.sslocal.com", (api) =>
      api
        .get("/api/diagnostics/whoami")
        .reply(200, { name: "test", email: "test@test.user.com" }),
    )
    .stdout()
    .command(["whoami"])
    .it("runs whoami", (ctx) => {
      expect(ctx.stdout).to.include("You are currently logged in as");
    });
});

// describe("whoami when unautheticated", () => {
//   beforeEach(() => {
//     ApiKeyStore.clear();
//   });

//   test
//     .stdout()
//     .command(["whoami"])
//     .it("runs whoami", (ctx) => {
//       expect(ctx.stdout).to.contain("\nYou are not currently logged in.");
//     });
// });
