import ShipengineAPIClient from "..";
// import { string } from "joi";
// import { Pulse } from "../../types";

export default class Deploys {
  private client: ShipengineAPIClient;

  constructor(apiClient: ShipengineAPIClient) {
    this.client = apiClient;
  }

  // async create(form: FormData, appName: string): Promise<string> {
  //   const response = await this._axios.post(`/apps/${appName}/deploys`, form, {
  //     headers: form.getHeaders(),
  //   });

  //   return response.data.deployId;

  //   try {
  //     const response = await this.client.call({
  //       endpoint: `/apps/${appName}/deploys`,
  //       method: "POST",
  //       body: { name, type },
  //       apiKey: this.client.apiKey,
  //     });

  //     return Promise.resolve(response);
  //   } catch (error) {
  //     return Promise.reject(error.response.data);
  //   }
  // }

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
