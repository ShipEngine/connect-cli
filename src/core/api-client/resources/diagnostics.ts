import { Pulse, NetworkErrorCollection } from "../../types";
import AppsAPIClient from '..';
import { AxiosError } from 'axios';

export default class Diagnostics {
  private client: AppsAPIClient;

  constructor(apiClient: AppsAPIClient) {
    this.client = apiClient;
  }

  /**
   * Check the API for a heart beat.
   * @returns {Promise} Promise object that resolves to a Pulse object.
   */
  async heartBeat(): Promise<Pulse> {
    try {
      const response = await this.client.call({
        endpoint: "diagnostics/heartbeat",
        method: "GET",
      }) as Promise<Pulse>;

      return Promise.resolve(response);
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        return Promise.reject(err.response.data as NetworkErrorCollection);
      }
      return Promise.reject(err.message);
    }
  }
}
