import Command from "../../../command";
// import { flags } from "@oclif/command";

export default class VersionsIndex extends Command {
  static description = "list versions belonging to an app";

  static examples = ["$ shipengine apps:versions"];

  async run() {
    this.log("versions 1, 2, 3");
  }
}
