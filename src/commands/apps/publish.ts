import BaseCommand from "../../base-command";
import { packageApp } from "../../shipengine-core/publish/package-app";
import { deployApp } from "../../shipengine-core/publish/deploy-app";
import cli from "cli-ux";
import logSymbols from "log-symbols";
import { flags } from '@oclif/command';
import fs from "fs";
import path from "path";

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


    // Make a backup copy of the package.json file since we are going to add the bundledDependencies attribute
    const pJsonBackup = await fs.promises.readFile(path.join(process.cwd(), "package.json"));

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
    finally {
      // Restore the package.json backup
      await fs.promises.writeFile(path.join(process.cwd(), "package.json"), pJsonBackup);
    }

    cli.action.stop(`${logSymbols.success}`);

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
    finally {
      // Delete the package tarball
      await fs.promises.unlink(tarballName);
    }
    cli.action.stop(`${logSymbols.success}`);


    // TODO: set watch flag to poll the deployment status
  }
}
