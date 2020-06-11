import BaseCommand from "../../base-command";
import { flags } from "@oclif/command";
import cli from "cli-ux";
import * as ApiKeyStore from "../../core/api-key-store";

export default class Login extends BaseCommand {
  static description = "login with your ShipEngine API key";

  static aliases = ["login"];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    this.parse(Login);

    try {
      const currentUser = await this.currentUser();
      this.log(`\nyou are currently logged in as: ${currentUser.email}`);

      const wishToContinue = await cli.prompt(
        "\ndo you with to login as someone else? (y,n)",
      );

      if (wishToContinue != "n" && wishToContinue != "y") {
        this.error(
          `'${wishToContinue}' is not a valid option, please enter 'y' or 'n'`,
          { exit: 1 },
        );
        return;
      }
      if (wishToContinue === "n") {
        this.log(`\nyou will remained logged in as: ${currentUser.email}`);
        return;
      }
    } catch {
      // No account currently logged in
      ApiKeyStore.clear();
    }

    const apiKey = await cli.prompt(
      "\nplease enter your shipengine engine API key",
      {
        type: "mask",
      },
    );

    try {
      await ApiKeyStore.set(apiKey);
    } catch (error) {
      ApiKeyStore.clear();
      this.error(error, { exit: 1 });
    }

    try {
      cli.action.start("verifying account");
      // Would rather use a /ping or /status endpoint here
      await this.currentUser();
    } catch {
      ApiKeyStore.clear();
      return this.error("the given API key is not valid", {
        exit: 1,
      });
    } finally {
      cli.action.stop();
    }

    this.log("\nyou have successfully logged in");
  }
}
