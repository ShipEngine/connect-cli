import ShipengineApiClinet from "../shipengine-api-client";
import { Deployment, DeploymentStatus, PlatformApp } from "../types";
import { promisify } from "util";
import * as readline from "readline";

const sleep = promisify(setTimeout);

function filterDeploymentInfo(deployment: Deployment): object {
  return {
    name: deployment.package.name,
    status: deployment.status,
  };
}

function writeDeploymentInfo(deployment: Deployment) {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0, 0);
  // process.stdout.write(deployment.status);
  console.log(filterDeploymentInfo(deployment));
}

/**
 * Poll for the status of a deployment. It will keep deploying at the desired interval until one of the following status is returned:
 * - terminated
 * - running
 * - error
 */
export async function watchDeployment(
  deployment: Deployment,
  app: PlatformApp,
  client: ShipengineApiClinet,
): Promise<DeploymentStatus> {
  let status = DeploymentStatus.Queued;

  while (
    status === DeploymentStatus.Queued ||
    status === DeploymentStatus.Building ||
    status === DeploymentStatus.Deploying
  ) {
    const updatedDeployment = await client.deployments.getById({
      deployId: deployment.deployId,
      appId: app.id,
    });
    writeDeploymentInfo(updatedDeployment);
    status = updatedDeployment.status;
    await sleep(5000);
  }

  return status;
}
