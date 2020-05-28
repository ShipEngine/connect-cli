import BaseCommand from "../../base-command";
import { packageApp } from "../../shipengine-core/publish/package-app";
import { deployApp } from "../../shipengine-core/publish/deploy-app";
import cli from "cli-ux";
import logSymbols from "log-symbols";
import { flags } from '@oclif/command';

// TODO: come up with a convention for turning off spinners if the user desires
export default class Publish extends BaseCommand {
  static description = "publish your app";

  static examples = ["$ shipengine apps:publish"];

  static flags = {
    help: flags.help({ char: "h", description: "show help for the apps:publish command" })
    // TODO: implement a quiet command?
  }

  // hide the command from help
  static hidden = true;

  async run() {

    // This is needed to register the "-h" flag
    this.parse(Publish);

    // Check that user is logged in
    const apiClient = this.client;
    if (!apiClient.isLoggedIn) {
      await apiClient.login();
    }

    // TODO: Run test harness here once it's done.

    cli.action.start("Packaging App");
    let tarballName;
    try {
      tarballName = await packageApp();
    }
    catch (error) {
      let err = error as Error;
      const errorMessage = `Unable to bundle dependencies and package app: ${err.message}`;
      this.error(errorMessage);
    }

    cli.action.stop(`${logSymbols.success}\n`);

    cli.action.start("Deploying App");

    let deploymentID;
    try {
      deploymentID = await deployApp(tarballName, apiClient);
    }
    catch (error) {
      let err = error as Error;
      const errorMessage = `There was an error deploying your app to the integration platform: ${err.message}`;
      this.error(errorMessage);
    }

    cli.action.stop(`${logSymbols.success}\n`);
    this.log(`Deployment ID: ${deploymentID}\n`);

    // Show command for tracking the status of the user's deployment.
    this.log("To track the status of the deployment, please run the following command:");
    this.log(`shipengine apps:info ${deploymentID}`);
  }
}
