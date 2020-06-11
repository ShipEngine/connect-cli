import BaseCommand from "../../base-command";
// import { flags } from "@heroku-cli/command";

export default class Logout extends BaseCommand {
  static description = "clears the local API key";

  static aliases = ["logout"];

  async run() {
    this.log("you have been logged out");
  }
}
