import _ from "lodash";
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import Generator = require("yeoman-generator");
import { execSync } from "child_process";

const debug = require("debug")("apps-new");
const fixpack = require("@oclif/fixpack");
const nps = require("nps-utils");
const sortPjson = require("sort-pjson");

const isWindows = process.platform === "win32";
const rmrf = isWindows ? "rimraf" : "rm -rf";

let hasYarn = false;

try {
  execSync("yarn -v", { stdio: "ignore" });
  hasYarn = true;
} catch {}

class AppsNew extends Generator {
  args!: { [k: string]: string };

  type: "carrier" | "order source";

  path: string;

  pjson: any;

  githubUser: string | undefined;

  answers!: {
    name: string;
    type: "carrier" | "order source";
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

    this.path = opts.path;
    this.type = "carrier";
  }

  // eslint-disable-next-line complexity
  async prompting() {
    this.log(this.banner());
    this.log(`Time to build a ShipEngine app!`);

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

    if (this.githubUser) {
      repository = `${this.githubUser}/${repository.split("/")[1]}`;
    }

    const defaults = {
      name: this.determineAppname().replace(/ /g, "-"),
      type: "carrier",
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
      pkg: "yarn",
      typescript: true,
      eslint: true,
      mocha: true,
    };

    this.repository = defaults.repository;

    if (this.repository && (this.repository as any).url) {
      this.repository = (this.repository as any).url;
    }

    if (this.options.skipQuestions) {
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
          type: "list",
          name: "type",
          message: "what type of app",
          choices: [
            { name: "carrier", value: "carrier" },
            // { name: "order source", value: "order source" },
          ],
          default: defaults.type,
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
          message: "Use mocha for testing (recommended)",
          default: () => true,
        },
      ])) as any;
    }

    debug(this.answers);

    this.type = this.answers.type;
    this.ts = this.answers.typescript;
    this.yarn = this.answers.pkg === "yarn";
    this.mocha = this.answers.mocha;
    this.eslint = this.answers.eslint;

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

    if (hasYarn) {
      // add yarn.lock file to package so we can lock plugin dependencies
      this.pjson.files.push("/yarn.lock");
    }

    this.pjson.keywords = defaults.keywords || [
      "ShipEngine",
      `${this.type} app`,
    ];

    this.pjson.homepage =
      defaults.homepage || `https://github.com/${this.pjson.repository}`;

    this.pjson.bugs =
      defaults.bugs || `https://github.com/${this.pjson.repository}/issues`;

    this.pjson.main =
      defaults.main || (this.ts ? "lib/index.js" : "src/index.js");

    if (this.ts) {
      this.pjson.types = defaults.types || "lib/index.d.ts";
    }
  }

  // eslint-disable-next-line complexity
  writing() {
    this.sourceRoot(path.join(__dirname, "../../templates"));

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

      if (eslintignore.trim()) {
        this.fs.write(
          this.destinationPath(".eslintignore"),
          this._eslintignore(),
        );
      }

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

    this.fs.writeJSON(
      this.destinationPath("./package.json"),
      sortPjson(this.pjson),
    );

    this.fs.copyTpl(
      this.templatePath("editorconfig"),
      this.destinationPath(".editorconfig"),
      this,
    );

    this.fs.copyTpl(
      this.templatePath("README.md.ejs"),
      this.destinationPath("README.md"),
      this,
    );

    if (this.pjson.license === "ISC") {
      this.fs.copyTpl(
        this.templatePath("LICENSE"),
        this.destinationPath("LICENSE"),
        this,
      );
    }

    this.fs.write(this.destinationPath(".gitignore"), this._gitignore());

    switch (this.type) {
      case "carrier":
        if (!fs.existsSync("src")) {
          this.fs.copyTpl(
            this.templatePath(`carrier/src/index.${this._ext}`),
            this.destinationPath(`src/index.${this._ext}`),
            this,
          );
        }

        if (this.mocha && !fs.existsSync("test")) {
          this.fs.copyTpl(
            this.templatePath(`carrier/test/index.test.${this._ext}`),
            this.destinationPath(`test/index.test.${this._ext}`),
            this,
          );
        }
        break;
      case "order source":
        if (!fs.existsSync("src")) {
          this.fs.copyTpl(
            this.templatePath(`order-source/src/index.${this._ext}`),
            this.destinationPath(`src/index.${this._ext}`),
            this,
          );
        }

        if (this.mocha && !fs.existsSync("test")) {
          this.fs.copyTpl(
            this.templatePath(`order-source/test/index.test.${this._ext}`),
            this.destinationPath(`test/index.test.${this._ext}`),
            this,
          );
        }
        break;
    }
  }

  install() {
    const dependencies: string[] = [];
    const devDependencies: string[] = [];

    devDependencies.push("@shipengine/integration-platform-sdk@^0.0.5");

    if (this.mocha) {
      devDependencies.push("mocha@^5", "nyc@^14", "chai@^4");
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
    ]).then(() => {});
  }

  end() {
    this.log(`\nCreated ${this.pjson.name} in ${this.destinationRoot()}`);
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

  private banner() {
    return chalk.blueBright(`
         .;i1:                      .iii,
        1GLtt;                      ,ttfGL.
       :8t             .,..             ;81
       ;8i         ,,  iiii. .,.        ,0t
       ;81       ,i1i;;iiii;;i1i:       ,8t
       :81       .;iii1iiii1iiii.       :8t
      .18i     .::;iii:.  .:iiii,,.     ,GL.
     .L8f      :111iii      ;iii11;      i0G,
      .10;     .,,;iii:.  .:iiii::,     ,GC,
       :81       .;iii1iiii1iii;.       :8f
       ;81       ,i1i;;iiii;;i1i:       :0f
       ;8i         ,.  ;1ii. .,.        ,0f
       :8t             .,,.             ;8f
        tGf11:                      ,t1fGL,
         .;i1:                      .1ii:
`);
  }
}

export = AppsNew;
