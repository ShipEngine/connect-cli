import ShipengineAPIClient from "..";
import { PlatformApp } from "../../types";

export default class Apps {
  private client: ShipengineAPIClient;

  constructor(apiClient: ShipengineAPIClient) {
    this.client = apiClient;
  }

  // /**
  //  * Creates a new App.
  //  * @returns {Promise} Promise object that resolves to an Array of PlatformApp objects.
  //  */
  // async create(body: {}): Promise<PlatformApp> {
  //   try {
  //     const response = await this.client.call({
  //       endpoint: "apps",
  //       method: "POST",
  //       body: body,
  //       apiKey: this.client.apiKey,
  //     });

  //     return Promise.resolve(response);
  //   } catch (error) {
  //     return Promise.reject(error);
  //   }
  // }

  /**
   * Gets all Apps that belong to the given API key.
   * @returns {Promise} Promise object that resolves to an Array of PlatformApp objects.
   */
  async getAll(): Promise<PlatformApp[]> {
    try {
      const response = await this.client.call({
        endpoint: "apps",
        method: "GET",
        apiKey: this.client.apiKey,
      });

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }

  /**
   * Get an App by its ID.
   * @returns {Promise} Promise object that resolves to a PlatformApp object.
   */
  async getById(id: string): Promise<PlatformApp> {
    try {
      const response = await this.client.call({
        endpoint: `apps/${id}`,
        method: "GET",
        apiKey: this.client.apiKey,
      });

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }

  /**
   * Get an App by its name.
   * @returns {Promise} Promise object that resolves to a PlatformApp object.
   */
  async getByName(name: string): Promise<PlatformApp> {
    try {
      const response = await this.client.call({
        endpoint: `apps?name=${encodeURI(name)}`,
        method: "GET",
        apiKey: this.client.apiKey,
      });

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
