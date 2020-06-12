import * as fs from "fs";
import FormData from "form-data";
import ShipengineAPIClient from "..";
import { NewDeployment } from "../../types";

export default class Deploys {
  private client: ShipengineAPIClient;

  constructor(apiClient: ShipengineAPIClient) {
    this.client = apiClient;
  }

  async create({
    appId,
    pathToTarball,
  }: {
    appId: string;
    pathToTarball: string;
  }): Promise<NewDeployment> {
    const form = new FormData();
    form.append("deployment", fs.createReadStream(pathToTarball));

    try {
      const response = await this.client.call({
        endpoint: `apps/${appId}/deploys`,
        method: "POST",
        body: form,
        headers: {
          "content-type": `multipart/form-data; boundary=${form.getBoundary()}`,
        },
        isFileUpload: true,
      });

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }

  // /**
  //  * Gets the current user for the given API key.
  //  * @returns {Promise} Promise object that resolves to a User object.
  //  */
  // async getById(deployId: string, appId: string): Promise<Deployment> {
  //   let response = await this._axios.get(
  //     `/apps/${appName}/deploys/${deploymentID}`,
  //   );

  //   return response.data as DeploymentStatusObj;
  // }

  // /**
  //  * Gets the current user for the given API key.
  //  * @returns {Promise} Promise object that resolves to a User object.
  //  */
  // async getAllForAppId(appId: string): Promise<Deployment> {
  //   let response = await this._axios.get(
  //     `/apps/${appName}/deploys/${deploymentID}`,
  //   );

  //   return response.data as DeploymentStatusObj;
  // }
}
