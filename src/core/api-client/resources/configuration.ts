import ShipengineAPIClient from "..";
import {NetworkErrorCollection} from "../../types";
import {ConfigurationKey} from "../../types/configuration-key";

export default class Configuration {
  private client: ShipengineAPIClient;

  constructor(apiClient: ShipengineAPIClient) {
    this.client = apiClient;
  }

  async list(appId: string): Promise<ConfigurationKey[]> {
    try {
      const response = await this.client.call<ConfigurationKey[]>({
        endpoint: `apps/${appId}/configuration/keys`,
        method: "GET"
      });
      return response;
    } catch (error) {
      return Promise.reject(error.response.data as NetworkErrorCollection);
    }
  }
}
