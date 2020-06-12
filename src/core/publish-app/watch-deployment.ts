import ShipengineApiClinet from "../shipengine-api-client";
import { Deployment, DeploymentStatus, PlatformApp } from "../types";
import { promisify } from "util";

const sleep = promisify(setTimeout);

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
    console.log(updatedDeployment);
    status = updatedDeployment.status;
    await sleep(5000);
  }

  return status;
}
