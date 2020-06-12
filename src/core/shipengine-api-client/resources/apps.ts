import ShipengineAPIClient from "..";
import { PlatformApp, PaginatedItems } from "../../types";

export default class Apps {
  private client: ShipengineAPIClient;

  constructor(apiClient: ShipengineAPIClient) {
    this.client = apiClient;
  }

  /**
   * Creates a new App.
   * @returns {Promise} Promise object that resolves to a PlatformApp object.
   */
  async create({
    name,
    type,
  }: {
    name: string;
    type: "carrier";
  }): Promise<PlatformApp> {
    try {
      const response = await this.client.call({
        endpoint: "apps",
        method: "POST",
        body: { name, type },
      });

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }

  /**
   * Creates a new App.
   * @returns {Promise} Promise object that resolves to a PlatformApp object.
   */
  async findOrCreate({
    name,
    type,
  }: {
    name: string;
    type: "carrier";
  }): Promise<PlatformApp> {
    try {
      const response = await this.client.call({
        endpoint: "apps",
        method: "POST",
        body: { name, type },
      });

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }

  /**
   * Gets all Apps that belong to the given API key.
   * @returns {Promise} Promise object that resolves to an Array of PlatformApp objects.
   */
  async getAll(): Promise<PaginatedItems<PlatformApp>> {
    try {
      const response = await this.client.call({
        endpoint: "apps",
        method: "GET",
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
      });

      if (response.items[0]) {
        return Promise.resolve(response.items[0]);
      } else {
        return Promise.reject({ status: 404 });
      }
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }
}
