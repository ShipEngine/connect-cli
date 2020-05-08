// "use strict";

// const { expect, test } = require("@oclif/test");
// const fs = require("fs");
// const path = require("path");
// const testDirectory = "test-app";
// const pathToTestDirectory = path.join(__dirname, `../../../${testDirectory}`);

// async function deleteTestApp() {
//   return new Promise(function (resolve, reject) {
//     fs.access(pathToTestDirectory, (directoryNotFoundError) => {
//       if (!directoryNotFoundError) {
//         fs.rmdir(
//           pathToTestDirectory,
//           {
//             recursive: true,
//           },
//           (error) => {
//             if (error) {
//               reject(`could not delete ${testDirectory}`);
//             } else {
//               resolve("done");
//             }
//           },
//         );
//       } else {
//         resolve("done");
//       }
//     });
//   });
// }

// describe("apps:new", () => {
//   // afterEach(async () => {
//   //   await deleteTestApp();
//   // });

//   test
//     .stdout()
//     .command(["apps:new", testDirectory, "-y"])
//     .it("scaffolds a new app", (ctx) => {
//       expect(ctx.stdout).to.contain("Time to build a ShipEngine app!\n");
//     });
// });
