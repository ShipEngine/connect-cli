import BaseCommand from "../../base-command";
import { loadApp } from "@shipengine/integration-platform-loader";
// import path from "path";
// import { flags } from "@oclif/command";

export default class Test extends BaseCommand {
  static description = "test your app";

  static examples = ["$ shipengine apps:test"];

  async run() {
    const pathToApp = `${process.cwd()}`;


  }
}
