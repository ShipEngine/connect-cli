"use strict";

const helpers = require("yeoman-test");
let assert = require("yeoman-assert");
const path = require("path");
const AppsNew = require("../../lib/generators/apps-new");

describe("generator apps:new", function () {
  describe("when given skipQuestions", function () {
    it("generates a new app", function () {
      // The object returned acts like a promise, so return it to wait until the process is done
      return helpers
        .run(AppsNew, {
          resolved: path.join(__dirname, "../../lib/generators/apps-new"),
          namespace: "apps:new",
        })
        .withOptions({ skipQuestions: true }) // Mock options passed in
        .withArguments(["test-app"]) // Mock the arguments
        .then(function () {
          assert.file([
            "src/index.ts",
            "test/index.test.ts",
            "test/mocha.opts",
            "test/tsconfig.json",
            ".editorconfig",
            ".eslintignore",
            ".eslintrc",
            "LICENSE",
            "README.md",
            "README.md",
            "package.json",
            "tsconfig.json",
          ]);
        });
    });
  });

  // describe("when configured without test", function () {
  //   it("generates a new app", function () {
  //     // The object returned acts like a promise, so return it to wait until the process is done
  //     return helpers
  //       .run(AppsNew, {
  //         resolved: path.join(__dirname, "../../lib/generators/apps-new"),
  //         namespace: "apps:new",
  //       })
  //       .withPrompts({ coffee: false })
  //       .withPrompts({ coffee: false })
  //       .withPrompts({ coffee: false })
  //       .withPrompts({ coffee: false })
  //       .withArguments(["test-app"]) // Mock the arguments
  //       .then(function () {
  //         assert.file([
  //           "src/index.ts",
  //           "test/index.test.ts",
  //           "test/mocha.opts",
  //           "test/tsconfig.json",
  //           ".editorconfig",
  //           ".eslintignore",
  //           ".eslintrc",
  //           "LICENSE",
  //           "README.md",
  //           "README.md",
  //           "package.json",
  //           "tsconfig.json",
  //         ]);
  //         assert.noFile(["test/index.test.ts", "mocha.opts"]);
  //       });
  //   });
  // });
});
