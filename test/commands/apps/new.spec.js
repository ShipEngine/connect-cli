// "use strict";

// const { expect, test } = require("@oclif/test");
// const sinon = require("sinon");
// const yeomanEnv = require("yeoman-environment");

// const yeomanEnvMock = sinon.mock({
//   run: (namespace, options, callback) => {
//     callback();
//   },
//   register: () => {},
// });

// describe("apps:new", () => {
//   beforeEach(() => {
//     sinon.stub(yeomanEnv, "createEnv").returns(yeomanEnvMock);
//   });

//   test
//     .stdout()
//     .command(["apps:new"])
//     .it("calls the apps:new generator with the given args and flags", (ctx) => {
//       expect(ctx.stdout).to.contain("Time to build a ShipEngine app!\n");
//       yeomanEnvMock.expects("register").once();
//       yeomanEnvMock.expects("run").once();
//       yeomanEnvMock.verify();
//     });

//   afterEach(() => {
//     sinon.restore();
//   });
// });
