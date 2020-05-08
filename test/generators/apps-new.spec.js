"use strict";

const helpers = require("yeoman-test");
let assert = require("yeoman-assert");
const path = require("path");
const AppsNew = require("../../lib/generators/apps-new");

describe("generator apps:new", function () {
  describe("defaults", function () {
    it("generates a new app", function () {
      // The object returned acts like a promise, so return it to wait until the process is done
      return helpers
        .run(AppsNew, {
          resolved: path.join(__dirname, "../../lib/generators/apps-new"),
          namespace: "apps:new",
        })
        .withArguments(["test-app"]) // Mock the arguments
        .withPrompts({ type: "carrier" })
        .withPrompts({ author: "test" })
        .withPrompts({ version: "0.0.0" })
        .withPrompts({ "github.user": "test" })
        .withPrompts({ "github.repo": "https://github.com/test/test" })
        .withPrompts({ eslint: true })
        .withPrompts({ mocha: true })
        .withPrompts({ pkg: true })
        .withPrompts({ typescript: true })
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

          assert.jsonFileContent("package.json", { main: "lib/index.js" });
        });
    });
  });

  describe("when configured without test", function () {
    it("generates a new app", function () {
      // The object returned acts like a promise, so return it to wait until the process is done
      return helpers
        .run(AppsNew, {
          resolved: path.join(__dirname, "../../lib/generators/apps-new"),
          namespace: "apps:new",
        })
        .withPrompts({ type: "carrier" })
        .withPrompts({ author: "test" })
        .withPrompts({ version: "0.0.0" })
        .withPrompts({ "github.user": "test" })
        .withPrompts({ "github.repo": "https://github.com/test/test" })
        .withPrompts({ eslint: true })
        .withPrompts({ mocha: false })
        .withPrompts({ pkg: true })
        .withPrompts({ typescript: true })
        .withArguments(["test-app"]) // Mock the arguments
        .then(function () {
          assert.file([
            "src/index.ts",
            ".editorconfig",
            ".eslintignore",
            ".eslintrc",
            "LICENSE",
            "README.md",
            "package.json",
            "tsconfig.json",
          ]);

          assert.noFile([
            "test/index.test.ts",
            "test/mocha.opts",
            "test/tsconfig.json",
          ]);

          assert.jsonFileContent("package.json", { main: "lib/index.js" });
        });
    });
  });

  describe("when configured without eslint", function () {
    it("generates a new app", function () {
      // The object returned acts like a promise, so return it to wait until the process is done
      return helpers
        .run(AppsNew, {
          resolved: path.join(__dirname, "../../lib/generators/apps-new"),
          namespace: "apps:new",
        })
        .withPrompts({ type: "carrier" })
        .withPrompts({ author: "test" })
        .withPrompts({ version: "0.0.0" })
        .withPrompts({ "github.user": "test" })
        .withPrompts({ "github.repo": "https://github.com/test/test" })
        .withPrompts({ eslint: false })
        .withPrompts({ mocha: true })
        .withPrompts({ pkg: true })
        .withPrompts({ typescript: true })
        .withArguments(["test-app"]) // Mock the arguments
        .then(function () {
          assert.file([
            "src/index.ts",
            "test/index.test.ts",
            "test/mocha.opts",
            "test/tsconfig.json",
            ".editorconfig",
            "LICENSE",
            "README.md",
            "package.json",
            "tsconfig.json",
          ]);

          assert.noFile([".eslintignore", ".eslintrc"]);
          assert.jsonFileContent("package.json", { main: "lib/index.js" });
        });
    });
  });

  describe("when configured without TypeScript", function () {
    it("generates a new app", function () {
      // The object returned acts like a promise, so return it to wait until the process is done
      return helpers
        .run(AppsNew, {
          resolved: path.join(__dirname, "../../lib/generators/apps-new"),
          namespace: "apps:new",
        })
        .withPrompts({ type: "carrier" })
        .withPrompts({ author: "test" })
        .withPrompts({ version: "0.0.0" })
        .withPrompts({ "github.user": "test" })
        .withPrompts({ "github.repo": "https://github.com/test/test" })
        .withPrompts({ eslint: true })
        .withPrompts({ mocha: true })
        .withPrompts({ pkg: true })
        .withPrompts({ typescript: false })
        .withArguments(["test-app"]) // Mock the arguments
        .then(function () {
          assert.file([
            "src/index.js",
            "test/index.test.js",
            "test/mocha.opts",
            ".editorconfig",
            ".eslintrc",
            "LICENSE",
            "README.md",
            "package.json",
          ]);

          assert.noFile([
            "src/index.ts",
            "test/tsconfig.json",
            ".eslintignore",
            "tsconfig.json",
          ]);

          assert.jsonFileContent("package.json", { main: "src/index.js" });
        });
    });
  });
});
