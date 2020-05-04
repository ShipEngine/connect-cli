import Command from "../../command";
import { flags } from "@oclif/command";

export default class AppsIndex extends Command {
  static description =
    "create a new project to develop a custom ShipEngine integration";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static examples = ["apps:new"];

  async run() {
    this._help();
  }
}
