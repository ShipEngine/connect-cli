import * as ApiKeyStore from "../../core/api-key-store";
import BaseCommand from "../../base-command";
import { flags } from "@oclif/command";

export default class Logout extends BaseCommand {
  static description = "clears the local API key";

  static aliases = ["logout"];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    this.parse(Logout);

    ApiKeyStore.clear();

    this.log("\nYou have been logged out.");
  }
}
