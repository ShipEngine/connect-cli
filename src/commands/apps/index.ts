import Command from "../../command";
// import { flags } from "@oclif/command";

export default class AppsIndex extends Command {
  static description = "list your apps";

  static examples = ["$ shipengine apps"];

  async run() {
    this.log("foo, bar, baz");
  }
}
