import { execSync } from "child_process";
import * as fs from "fs";
// import * as _ from 'lodash'
import * as path from "path";
import Generator = require("yeoman-generator");

const nps = require("nps-utils");
// const sortPjson = require("sort-pjson");
// const fixpack = require("@oclif/fixpack");
const debug = require("debug")("generator-shipengine");
const { version } = require("../../package.json");

const isWindows = process.platform === "win32";
const rmrf = isWindows ? "rimraf" : "rm -rf";
const rmf = isWindows ? "rimraf" : "rm -f";

let hasYarn = false;

try {
  execSync("yarn -v", { stdio: "ignore" });
  hasYarn = true;
} catch {}

class AppsNew extends Generator {
  options: {
    defaults?: boolean;
    mocha: boolean;
    typescript: boolean;
    eslint: boolean;
    yarn: boolean;
  };

  args!: { [k: string]: string };

  type: "carrier" | "order-source";

  path: string;

  pjson: any;

  githubUser: string | undefined;

  answers!: {
    name: string;
    description: string;
    version: string;
    github: { repo: string; user: string };
    author: string;
    files: string;
    license: string;
    pkg: string;
    typescript: boolean;
    eslint: boolean;
    mocha: boolean;
  };

  mocha!: boolean;

  ts!: boolean;

  eslint!: boolean;

  yarn!: boolean;

  get _ext() {
    return this.ts ? "ts" : "js";
  }

  repository?: string;

  constructor(args: any, opts: any) {
    super(args, opts);

    this.type = opts.type;
    this.path = opts.path;
    this.options = {
      defaults: opts.defaults,
      mocha: opts.options.includes("mocha"),
      typescript: opts.options.includes("typescript"),
      eslint: opts.options.includes("eslint"),
      yarn: opts.options.includes("yarn") || hasYarn,
    };
  }

  // eslint-disable-next-line complexity
  async prompting() {
    let msg;
    switch (this.type) {
      case "carrier":
        msg = "Time to build a ShipEngine carrier app!";
        break;
      case "order-source":
        msg = "Time to build a ShipEngine order-source app!";
        break;
      default:
        msg = `Time to build a ShipEngine ${this.type} app!`;
    }
    this.log(`${msg} Version: ${version}`);

    if (this.path) {
      this.destinationRoot(path.resolve(this.path));
      process.chdir(this.destinationRoot());
    }

    this.githubUser = await this.user.github.username().catch(debug);

    this.pjson = {
      scripts: {},
      engines: {},
      devDependencies: {},
      dependencies: {},
      ...this.fs.readJSON("package.json", {}),
    };

    let repository = this.destinationRoot().split(path.sep).slice(-2).join("/");

    if (this.githubUser)
      repository = `${this.githubUser}/${repository.split("/")[1]}`;
    const defaults = {
      name: this.determineAppname().replace(/ /g, "-"),
      version: "0.0.0",
      license: "ISC",
      author: this.githubUser
        ? `${this.user.git.name()} @${this.githubUser}`
        : this.user.git.name(),
      dependencies: {},
      repository,
      ...this.pjson,
      engines: {
        node: ">=8.0.0",
        ...this.pjson.engines,
      },
      options: this.options,
    };

    this.repository = defaults.repository;

    if (this.repository && (this.repository as any).url) {
      this.repository = (this.repository as any).url;
    }

    if (this.options.defaults) {
      this.answers = defaults;
    } else {
      this.answers = (await this.prompt([
        {
          type: "input",
          name: "name",
          message: "npm package name",
          default: defaults.name,
          when: !this.pjson.name,
        },
        {
          type: "input",
          name: "description",
          message: "description",
          default: defaults.description,
          when: !this.pjson.description,
        },
        {
          type: "input",
          name: "author",
          message: "author",
          default: defaults.author,
          when: !this.pjson.author,
        },
        {
          type: "input",
          name: "version",
          message: "version",
          default: defaults.version,
          when: !this.pjson.version,
        },
        {
          type: "input",
          name: "license",
          message: "license",
          default: defaults.license,
          when: !this.pjson.license,
        },
        {
          type: "input",
          name: "github.user",
          message:
            "Who is the GitHub owner of repository (https://github.com/OWNER/repo)",
          default: repository.split("/").slice(0, -1).pop(),
          when: !this.pjson.repository,
        },
        {
          type: "input",
          name: "github.repo",
          message:
            "What is the GitHub name of repository (https://github.com/owner/REPO)",
          default: (answers: any) =>
            (this.pjson.repository || answers.name || this.pjson.name)
              .split("/")
              .pop(),
          when: !this.pjson.repository,
        },
        {
          type: "list",
          name: "pkg",
          message: "Select a package manager",
          choices: [
            { name: "npm", value: "npm" },
            { name: "yarn", value: "yarn" },
          ],
          default: () => (this.options.yarn || hasYarn ? 1 : 0),
        },
        {
          type: "confirm",
          name: "typescript",
          message: "TypeScript",
          default: () => true,
        },
        {
          type: "confirm",
          name: "eslint",
          message: "Use eslint (linter for JavaScript and Typescript)",
          default: () => true,
        },
        {
          type: "confirm",
          name: "mocha",
          message: "Use mocha (testing framework)",
          default: () => true,
        },
      ])) as any;
    }
    debug(this.answers);

    if (!this.options.defaults) {
      this.options = {
        mocha: this.answers.mocha,
        eslint: this.answers.eslint,
        typescript: this.answers.typescript,
        yarn: this.answers.pkg === "yarn",
      };
    }

    this.ts = this.options.typescript;
    this.yarn = this.options.yarn;
    this.mocha = this.options.mocha;
    this.eslint = this.options.eslint;

    this.pjson.name = this.answers.name || defaults.name;
    this.pjson.description = this.answers.description || defaults.description;
    this.pjson.version = this.answers.version || defaults.version;
    this.pjson.engines.node = defaults.engines.node;
    this.pjson.author = this.answers.author || defaults.author;
    this.pjson.files = this.answers.files ||
      defaults.files || [this.ts ? "/lib" : "/src"];
    this.pjson.license = this.answers.license || defaults.license;
    // eslint-disable-next-line no-multi-assign
    this.repository = this.pjson.repository = this.answers.github
      ? `${this.answers.github.user}/${this.answers.github.repo}`
      : defaults.repository;
    if (this.eslint) {
      this.pjson.scripts.posttest = "eslint .";
    }
    if (this.mocha) {
      this.pjson.scripts.test = `nyc ${
        this.ts ? "--extension .ts " : ""
      }mocha --forbid-only "test/**/*.test.${this._ext}"`;
    } else {
      this.pjson.scripts.test = "echo NO TESTS";
    }
    if (this.ts) {
      this.pjson.scripts.prepack = nps.series(`${rmrf} lib`, "tsc -b");
      if (this.eslint) {
        this.pjson.scripts.posttest = "eslint . --ext .ts --config .eslintrc";
      }
    }
    if (["plugin", "multi"].includes(this.type)) {
      this.pjson.scripts.prepack = nps.series(
        this.pjson.scripts.prepack,
        "oclif-dev manifest",
        "oclif-dev readme",
      );
      this.pjson.scripts.version = nps.series(
        "oclif-dev readme",
        "git add README.md",
      );
    } else if (this.type === "carrier") {
      this.pjson.scripts.prepack = nps.series(
        this.pjson.scripts.prepack,
        "oclif-dev readme",
      );
      this.pjson.scripts.version = nps.series(
        "oclif-dev readme",
        "git add README.md",
      );
    }
    if (this.type === "plugin" && hasYarn) {
      // for plugins, add yarn.lock file to package so we can lock plugin dependencies
      this.pjson.files.push("/yarn.lock");
    }
    this.pjson.keywords = defaults.keywords || [
      this.type === "plugin" ? "oclif-plugin" : "oclif",
    ];
    this.pjson.homepage =
      defaults.homepage || `https://github.com/${this.pjson.repository}`;
    this.pjson.bugs =
      defaults.bugs || `https://github.com/${this.pjson.repository}/issues`;

    // if (["single", "multi"].includes(this.type)) {
    //   this.pjson.bin = this.pjson.bin || {};
    //   this.pjson.bin[this.pjson.oclif.bin] = "./bin/run";
    //   this.pjson.files.push("/bin");
    // } else if (this.type === "plugin") {
    //   this.pjson.oclif.bin = "oclif-example";
    // }
    // if (this.type !== "plugin") {
    //   this.pjson.main =
    //     defaults.main || (this.ts ? "lib/index.js" : "src/index.js");
    //   if (this.ts) {
    //     this.pjson.types = defaults.types || "lib/index.d.ts";
    //   }
    // }
  }

  // eslint-disable-next-line complexity
  writing() {
    this.sourceRoot(path.join(__dirname, "../../templates"));

    // switch (this.type) {
    //   case "multi":
    //   case "plugin":
    //     this.pjson.oclif = {
    //       commands: `./${this.ts ? "lib" : "src"}/commands`,
    //       // hooks: {init: `./${this.ts ? 'lib' : 'src'}/hooks/init`},
    //       ...this.pjson.oclif,
    //     };
    //     break;
    //   default:
    // }
    // if (this.type === "plugin" && !this.pjson.oclif.devPlugins) {
    //   this.pjson.oclif.devPlugins = ["@oclif/plugin-help"];
    // }
    // if (this.type === "multi" && !this.pjson.oclif.plugins) {
    //   this.pjson.oclif.plugins = ["@oclif/plugin-help"];
    // }

    if (this.pjson.oclif && Array.isArray(this.pjson.oclif.plugins)) {
      this.pjson.oclif.plugins.sort();
    }

    if (this.ts) {
      this.fs.copyTpl(
        this.templatePath("tsconfig.json"),
        this.destinationPath("tsconfig.json"),
        this,
      );
      if (this.mocha) {
        this.fs.copyTpl(
          this.templatePath("test/tsconfig.json"),
          this.destinationPath("test/tsconfig.json"),
          this,
        );
      }
    }
    if (this.eslint) {
      const eslintignore = this._eslintignore();
      if (eslintignore.trim())
        this.fs.write(
          this.destinationPath(".eslintignore"),
          this._eslintignore(),
        );
      if (this.ts) {
        this.fs.copyTpl(
          this.templatePath("eslintrc.typescript"),
          this.destinationPath(".eslintrc"),
          this,
        );
      } else {
        this.fs.copyTpl(
          this.templatePath("eslintrc"),
          this.destinationPath(".eslintrc"),
          this,
        );
      }
    }
    if (this.mocha) {
      this.fs.copyTpl(
        this.templatePath("test/mocha.opts"),
        this.destinationPath("test/mocha.opts"),
        this,
      );
    }
    if (this.fs.exists(this.destinationPath("./package.json"))) {
      fixpack(
        this.destinationPath("./package.json"),
        require("@oclif/fixpack/config.json"),
      );
    }
    if (_.isEmpty(this.pjson.oclif)) delete this.pjson.oclif;
    this.pjson.files = _.uniq((this.pjson.files || []).sort());
    this.fs.writeJSON(
      this.destinationPath("./package.json"),
      sortPjson(this.pjson),
    );
    this.fs.copyTpl(
      this.templatePath("editorconfig"),
      this.destinationPath(".editorconfig"),
      this,
    );
    if (this.circleci) {
      this.fs.copyTpl(
        this.templatePath("circle.yml.ejs"),
        this.destinationPath(".circleci/config.yml"),
        this,
      );
    }
    if (this.appveyor) {
      this.fs.copyTpl(
        this.templatePath("appveyor.yml.ejs"),
        this.destinationPath("appveyor.yml"),
        this,
      );
    }
    if (this.travisci) {
      this.fs.copyTpl(
        this.templatePath("travis.yml.ejs"),
        this.destinationPath(".travis.yml"),
        this,
      );
    }

    this.fs.copyTpl(
      this.templatePath("README.md.ejs"),
      this.destinationPath("README.md"),
      this,
    );
    if (
      this.pjson.license === "MIT" &&
      (this.pjson.repository.startsWith("oclif") ||
        this.pjson.repository.startsWith("heroku"))
    ) {
      this.fs.copyTpl(
        this.templatePath("LICENSE.mit"),
        this.destinationPath("LICENSE"),
        this,
      );
    }

    this.fs.write(this.destinationPath(".gitignore"), this._gitignore());

    switch (this.type) {
      case "single":
        this._writeSingle();
        break;
      case "plugin":
        this._writePlugin();
        break;
      case "multi":
        this._writeMulti();
        break;
      default:
        this._writeBase();
    }
  }

  install() {
    const dependencies: string[] = [];
    const devDependencies: string[] = [];
    switch (this.type) {
      case "base":
        break;
      case "single":
        dependencies.push(
          "@oclif/config@^1",
          "@oclif/command@^1",
          "@oclif/plugin-help@^2",
        );
        devDependencies.push("@oclif/dev-cli@^1");
        break;
      case "plugin":
        dependencies.push("@oclif/command@^1", "@oclif/config@^1");
        devDependencies.push(
          "@oclif/dev-cli@^1",
          "@oclif/plugin-help@^2",
          "globby@^10",
        );
        break;
      case "multi":
        dependencies.push(
          "@oclif/config@^1",
          "@oclif/command@^1",
          "@oclif/plugin-help@^2",
        );
        devDependencies.push("@oclif/dev-cli@^1", "globby@^10");
    }
    if (this.mocha) {
      devDependencies.push("mocha@^5", "nyc@^14", "chai@^4");
      if (this.type !== "base") devDependencies.push("@oclif/test@^1");
    }
    if (this.ts) {
      dependencies.push("tslib@^1");
      devDependencies.push("@types/node@^10", "typescript@^3.3", "ts-node@^8");
      if (this.mocha) {
        devDependencies.push("@types/chai@^4", "@types/mocha@^5");
      }
    }
    if (this.eslint) {
      devDependencies.push("eslint@^5.13", "eslint-config-oclif@^3.1");
      if (this.ts) {
        devDependencies.push("eslint-config-oclif-typescript@^0.1");
      }
    }
    if (isWindows) devDependencies.push("rimraf");
    const yarnOpts = {} as any;
    if (process.env.YARN_MUTEX) yarnOpts.mutex = process.env.YARN_MUTEX;
    const install = (deps: string[], opts: object) =>
      this.yarn ? this.yarnInstall(deps, opts) : this.npmInstall(deps, opts);
    const dev = this.yarn ? { dev: true } : { "save-dev": true };
    const save = this.yarn ? {} : { save: true };
    return Promise.all([
      install(devDependencies, { ...yarnOpts, ...dev, ignoreScripts: true }),
      install(dependencies, { ...yarnOpts, ...save }),
    ]).then(() => {
      // if (!this.yarn) {
      //   return this.spawnCommand('npm', ['shrinkwrap'])
      // }
    });
  }

  end() {
    if (["plugin", "multi", "single"].includes(this.type)) {
      this.spawnCommandSync(path.join(".", "node_modules/.bin/oclif-dev"), [
        "readme",
      ]);
    }
    console.log(`\nCreated ${this.pjson.name} in ${this.destinationRoot()}`);
  }

  private _gitignore(): string {
    const existing = this.fs.exists(this.destinationPath(".gitignore"))
      ? this.fs.read(this.destinationPath(".gitignore")).split("\n")
      : [];
    return (
      _([
        "*-debug.log",
        "*-error.log",
        "node_modules",
        "/tmp",
        "/dist",
        "/.nyc_output",
        this.yarn ? "/package-lock.json" : "/yarn.lock",
        this.ts && "/lib",
      ])
        .concat(existing)
        .compact()
        .uniq()
        .sort()
        .join("\n") + "\n"
    );
  }

  private _eslintignore(): string {
    const existing = this.fs.exists(this.destinationPath(".eslintignore"))
      ? this.fs.read(this.destinationPath(".eslintignore")).split("\n")
      : [];
    return (
      _([this.ts && "/lib"])
        .concat(existing)
        .compact()
        .uniq()
        .sort()
        .join("\n") + "\n"
    );
  }

  private _writeBase() {
    if (!fs.existsSync("src")) {
      this.fs.copyTpl(
        this.templatePath(`base/src/index.${this._ext}`),
        this.destinationPath(`src/index.${this._ext}`),
        this,
      );
    }
    if (this.mocha && !fs.existsSync("test")) {
      this.fs.copyTpl(
        this.templatePath(`base/test/index.test.${this._ext}`),
        this.destinationPath(`test/index.test.${this._ext}`),
        this,
      );
    }
  }

  private _writePlugin() {
    const cmd = `${bin} hello`;
    const opts = { ...(this as any), _, bin, cmd };
    this.fs.copyTpl(
      this.templatePath("plugin/bin/run"),
      this.destinationPath("bin/run"),
      opts,
    );
    this.fs.copyTpl(
      this.templatePath("bin/run.cmd"),
      this.destinationPath("bin/run.cmd"),
      opts,
    );
    const commandPath = this.destinationPath(`src/commands/hello.${this._ext}`);
    if (!fs.existsSync("src/commands")) {
      this.fs.copyTpl(
        this.templatePath(`src/command.${this._ext}.ejs`),
        commandPath,
        {
          ...opts,
          name: "hello",
          path: commandPath.replace(process.cwd(), "."),
        },
      );
    }
    // if (this.ts && this.type !== "multi") {
    //   this.fs.copyTpl(
    //     this.templatePath("plugin/src/index.ts"),
    //     this.destinationPath("src/index.ts"),
    //     opts,
    //   );
    // }
    if (this.mocha && !fs.existsSync("test")) {
      this.fs.copyTpl(
        this.templatePath(`test/command.test.${this._ext}.ejs`),
        this.destinationPath(`test/commands/hello.test.${this._ext}`),
        { ...opts, name: "hello" },
      );
    }
  }

  private _writeSingle() {
    const opts = { ...(this as any), _, name: this.pjson.name };
    this.fs.copyTpl(
      this.templatePath(`single/bin/run.${this._ext}`),
      this.destinationPath("bin/run"),
      opts,
    );
    this.fs.copyTpl(
      this.templatePath("bin/run.cmd"),
      this.destinationPath("bin/run.cmd"),
      opts,
    );
    const commandPath = this.destinationPath(`src/index.${this._ext}`);
    if (!this.fs.exists(`src/index.${this._ext}`)) {
      this.fs.copyTpl(
        this.templatePath(`src/command.${this._ext}.ejs`),
        this.destinationPath(`src/index.${this._ext}`),
        { ...opts, path: commandPath.replace(process.cwd(), ".") },
      );
    }
    if (this.mocha && !this.fs.exists(`test/index.test.${this._ext}`)) {
      this.fs.copyTpl(
        this.templatePath(`test/command.test.${this._ext}.ejs`),
        this.destinationPath(`test/index.test.${this._ext}`),
        opts,
      );
    }
  }

  private _writeMulti() {
    this._writePlugin();
    this.fs.copyTpl(
      this.templatePath("bin/run"),
      this.destinationPath("bin/run"),
      this,
    );
    this.fs.copyTpl(
      this.templatePath("bin/run.cmd"),
      this.destinationPath("bin/run.cmd"),
      this,
    );
    if (!this.fs.exists(`src/index.${this._ext}`)) {
      this.fs.copyTpl(
        this.templatePath(`multi/src/index.${this._ext}`),
        this.destinationPath(`src/index.${this._ext}`),
        this,
      );
    }
  }
}

export = AppsNew;
