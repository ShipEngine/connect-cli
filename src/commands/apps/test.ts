import BaseCommand from "../../base-command";
// import { flags } from "@oclif/command";
import {
  validateApp,
  validateTestSuite,
  InvalidAppError,
} from "../../shipengine-core/validate-app";
import chalk from "chalk";
import { App } from "@shipengine/integration-platform-loader";
import { flags } from "@oclif/command";
import { testSuites } from "../../shipengine-core/validate-app";
let app: App;

export default class Test extends BaseCommand {
  static description = "test your app";

  static examples = ["$ shipengine apps:test"];

  static flags = {
    help: flags.help({ char: "h" }),
    debug: flags.boolean({
      char: "d",
      description: "Provides additional logs to test output",
    }),
  };

  static args = [
    {
      name: "test suite",
      required: false,
      description: "Name of test suite to only run",
      options: testSuites,
    },
    {
      name: "test number",
      required: false,
      description: "Number within the test suite to run",
    },
  ];

  async run() {
    const pathToApp = `${process.cwd()}`;

    const { argv, flags } = this.parse(Test);

    if (flags.debug) {
      process.env["TEST_DEBUG"] = "true";
    }

    try {
      app = await validateApp(pathToApp);
      this.log("✅ App structure is valid");

      await validateTestSuite(app, argv);
    } catch (error) {
      if (error.code && error.code === "INVALID_APP") {
        const errorsCount = error.errors.length;
        const errorsWithInflection = errorsCount > 1 ? "errors" : "error";

        this.log(
          chalk.red(
            `App structure is not valid - ${errorsCount} ${errorsWithInflection} found\n`,
          ),
        );

        error.errors.forEach((errorMessage: string) => {
          this.log(`❌ ${errorMessage} `);
        });
      } else {
        this.error(error);
      }
    }
  }
}
