import ShipengineApiClinet from "../shipengine-api-client";
import { Deployment, DeploymentStatus, PlatformApp } from "../types";
import { promisify } from "util";
import * as readline from "readline";
import { green } from "chalk";

const sleep = promisify(setTimeout);

function writeDeploymentInfo(deployment: Deployment, count: number) {
  if (count > 0) {
    readline.moveCursor(process.stdout, 0, -1);
  }
  readline.clearScreenDown(process.stdout);
  console.log(
    `watching app... { name: ${green(deployment.package.name)}, status: ${green(
      deployment.status,
    )}}`,
  );
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
  let count = 0;

  while (
    status === DeploymentStatus.Queued ||
    status === DeploymentStatus.Building ||
    status === DeploymentStatus.Deploying
  ) {
    const updatedDeployment = await client.deployments.getById({
      deployId: deployment.deployId,
      appId: app.id,
    });
    writeDeploymentInfo(updatedDeployment, count);
    count++;
    status = updatedDeployment.status;
    await sleep(5000);
  }

  return status;
}
