import ShipengineApiClinet from "./shipengine-api-client";
import cli from "cli-ux";
import fs from "fs";
import logSymbols from "log-symbols";
import path from "path";
import { Deployment, DeploymentStatus } from "./types";
import { loadApp } from "@shipengine/integration-platform-loader";
import { packageApp } from "./publish-app/package-app";
import { watchDeployment } from "./publish-app/watch-deployment";

class AppFailedToPackageError extends Error {
  code: string;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.name = AppFailedToPackageError.name; // stack traces display correctly now
    this.code = "APP_FAILED_TO_PACKAGE";
  }
}

class AppFailedToDeployError extends Error {
  code: string;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.name = AppFailedToPackageError.name; // stack traces display correctly now
    this.code = "APP_FAILED_TO_DEPLOY";
  }
}

interface PublishAppOptions {
  watch?: boolean;
}

export default async function publishApp(
  pathToApp: string,
  client: ShipengineApiClinet,
  { watch = false }: PublishAppOptions,
): Promise<Deployment> {
  // Make a backup copy of the package.json file since we are going to add the bundledDependencies attribute
  const pJsonBackup = await fs.promises.readFile(
    path.join(pathToApp, "package.json"),
  );

  cli.action.start("packaging app");

  let tarballName: string;

  try {
    tarballName = await packageApp();
  } catch (error) {
    const errorMessage = `unable to bundle dependencies and package app: ${error.message}`;
    throw new AppFailedToPackageError(errorMessage);
  } finally {
    // Restore the package.json backup
    await fs.promises.writeFile(
      path.join(pathToApp, "package.json"),
      pJsonBackup,
    );
  }

  cli.action.stop(`${logSymbols.success}`);
  cli.action.start("publishing app");

  let newDeployment, platformApp;

  try {
    const app = await loadApp(process.cwd());

    // Find the tarball
    const pathToTarball = path.join(process.cwd(), tarballName);

    platformApp = await client.apps.findOrCreateByName({
      name: app.manifest.name,
      type: "carrier",
    });

    newDeployment = await client.deployments.create({
      appId: platformApp.id,
      pathToTarball: pathToTarball,
    });
  } catch (error) {
    const errorMessage = `there was an error deploying your app to the integration platform: ${error}`;
    throw new AppFailedToDeployError(errorMessage);
  } finally {
    // Delete the package tarball
    await fs.promises.unlink(tarballName);
  }

  cli.action.stop(`${logSymbols.success}`);

  if (watch) {
    cli.action.start("watching the app status");
    const status = await watchDeployment(newDeployment, platformApp, client);

    if (status === DeploymentStatus.Error) {
      cli.action.stop(`${logSymbols.error} your app encountered an error`);
    } else if (status === DeploymentStatus.Terminated) {
      cli.action.stop(`${logSymbols.error} your app was terminated`);
    } else {
      cli.action.stop(
        `${logSymbols.success} your app was published successfully`,
      );
    }
  }

  return newDeployment;
}
