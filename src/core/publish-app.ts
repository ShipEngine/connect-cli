import APIClient from "./api-client";
import cli from "cli-ux";
import fs from "fs";
import logSymbols from "log-symbols";
import path from "path";
import { Deployment, DeploymentStatus } from "./types";
import { loadApp } from "@shipengine/connect-loader";
import { watchDeployment } from "./publish-app/watch-deployment";
import { green, red } from "chalk";

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

export function isAppFailedToPackageError(obj: unknown): obj is AppFailedToPackageError {
  if (typeof obj === "object" && obj !== null) {
    const code = Reflect.get(obj, "code") as string | undefined;
    return code === "APP_FAILED_TO_PACKAGE";
  }

  return false;
}

export function isAppFailedToDeployError(obj: unknown): obj is AppFailedToDeployError {
  if (typeof obj === "object" && obj !== null) {
    const code = Reflect.get(obj, "code") as string | undefined;
    return code === "APP_FAILED_TO_DEPLOY";
  }

  return false;
}

interface PublishAppOptions {
  noWatch?: boolean;
}

export default async function publishApp(
  tarballName: string,
  client: APIClient,
  { noWatch = false }: PublishAppOptions,
): Promise<Deployment> {

  cli.action.start("publishing app");

  let newDeployment;
  let platformApp;
  try {
    const app = await loadApp(process.cwd());

    app.type
    // Find the tarball
    const pathToTarball = path.join(process.cwd(), tarballName);

    platformApp = await client.apps.findOrCreateByName({
      name: app.manifest.name,
      type: app.type,
    });

    newDeployment = await client.deployments.create({
      appId: platformApp.id,
      pathToTarball: pathToTarball,
    });
  } catch (error) {
    const err = error as Error;
    const errorMessage = `There was an error deploying your app to the connect platform: ${err.message}`;
    throw new AppFailedToDeployError(errorMessage);
  } finally {
    // Delete the package tarball
    await fs.promises.unlink(tarballName);
  }

  cli.action.stop(`${logSymbols.success}`);

  if (!noWatch) {
    const status = await watchDeployment(newDeployment, platformApp, client);

    if (status === DeploymentStatus.Error) {
      console.log(
        red(
          `Your app encountered an error during deployment ${logSymbols.error} `,
        ),
      );
      console.log(
        red(
          `- This error was most likely caused by an issue in the Connect Platform and not your application`,
        ),
      );
      console.log(
        red(
          `- If the error persist please contact Connect Support at support@shipengine.com and include the logs provided by the 'connect logs' command`,
        ),
      );
    } else if (status === DeploymentStatus.Terminated) {
      console.log(red(`your app was terminated `));
    } else {
      console.log(
        green(`Your app was published successfully ${logSymbols.success} `),
      );
    }
  }

  return newDeployment;
}
