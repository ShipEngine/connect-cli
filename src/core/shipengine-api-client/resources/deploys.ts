import ShipengineAPIClient from "..";
// import { Pulse } from "../../types";

export default class Deploys {
  private client: ShipengineAPIClient;

  constructor(apiClient: ShipengineAPIClient) {
    this.client = apiClient;
  }

  // /**
  //  * Check the API for a heart beat.
  //  * @returns {Promise} Promise object that resolves to a Pulse object.
  //  */
  // async create(body: {}): Promise<Pulse> {
  //   try {
  //     const response = await this.client.call({
  //       endpoint: "diagnostics/heartbeat",
  //       method: "GET",
  //     });

  //     return Promise.resolve(response);
  //   } catch (error) {
  //     return Promise.reject(error);
  //   }
  // }
}

// public async deployApp(form: FormData, appName: string): Promise<string> {
//   const response = await this._axios.post(`/apps/${appName}/deploys`, form, {
//     headers: form.getHeaders(),
//   });

//   return response.data.deployId;
// }

// public async getDeploymentStatus(
//   appName: string,
//   deploymentID: string,
// ): Promise<DeploymentStatusObj> {
//   let response = await this._axios.get(
//     `/apps/${appName}/deploys/${deploymentID}`,
//   );

//   return response.data as DeploymentStatusObj;
// }
