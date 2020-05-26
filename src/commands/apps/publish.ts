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

    // Check that user is logged in
    const apiClient = this.client;
    if(!apiClient.isLoggedIn) {
      await apiClient.login();
    }

    // TODO: Run test harness here once it's done.
    
    cli.action.start("Packing App");
    const tarballName = await packageApp();
    cli.action.stop(`${logSymbols.success}\n`);

    cli.action.start("Deploying App");

    let deploymentID;
    try {
      deploymentID = await deployApp(tarballName, apiClient);
    }
    catch(error) {
      let err = error as Error;
      const errorMessage = `Unable to deploy npm package to integration platform: ${err.message}`;
      this.error(errorMessage);
    }

    cli.action.stop(`${logSymbols.success}\n`);

    this.log(`Deployment ID: ${deploymentID}\n`);

    // Show command for tracking the status of the user's deployment.
    this.log("To track the status of the deployment, please run the following command:");
    this.log(`shipengine apps:info ${deploymentID}`);
  }
}
