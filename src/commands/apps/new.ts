import BaseCommand from "../../base-command";
import { flags } from "@oclif/command";
import { createTemplate } from "../../shipengine-core/create-template";

export default class New extends BaseCommand {
  static description =
    "create a new project to develop a custom ShipEngine app";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static examples = ["$ shipengine apps:test"];

  async run() {
    createTemplate();
  }
}
