import BaseCommand from "../../base-command";
import { packageApp } from "../../shipengine-core/publish/package-app";
import { deployApp } from "../../shipengine-core/publish/deploy-app";
import cli from "cli-ux";
import logSymbols from "log-symbols";

export default class Publish extends BaseCommand {
  static description = "publish your app";

  static examples = ["$ shipengine apps:publish"];

  // hide the command from help
  static hidden = true;

  async run() {

    // prompt for API Key?? Check for the apiCLient? and see if its been initialized yet

    // Run test harness

    // send the name, type, and carrier id to the deploy app command inline with the changes that bill requested.

    cli.action.start("Packing App");
    const tarballName = await packageApp();
    cli.action.stop(`${logSymbols.success}\n`);

    cli.action.start("Deploying App");
    const deploymentID = await deployApp(tarballName);
    cli.action.stop(`${logSymbols.success}\n`);

    console.log(`Deployment ID: ${deploymentID}\n`);
  }
}
