import * as ApiKeyStore from "../../core/api-key-store";
import BaseCommand from "../../base-command";
import cli from "cli-ux";
import { flags } from "@oclif/command";

export default class Logout extends BaseCommand {
  static description = "clears the local API key";

  static aliases = ["logout"];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    this.parse(Logout);

    cli.action.start("Logging out");

    ApiKeyStore.clear();

    cli.action.stop();

    this.log("\nYou have been logged out.");
  }
}
