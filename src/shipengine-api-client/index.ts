import axios, { AxiosInstance } from "axios";
import FormData from "form-data";


/**
 * Add helper methods for ShipEngine API specific HTTP calls.
 */
export default class ShipengineAPIClient {
  private _apiKey: string;
  private _axios: AxiosInstance;

  public async deployApp(form: FormData, appID: string): Promise<string> {
    const response =  await this._axios.post(`/deploy/${appID}`, form, {
      headers: form.getHeaders()
    })

    return response.data.deployId;
  }

  protected get apiKey(): string {
    return this._apiKey;
  }

  protected set apiKey(apiKey: string) {
    this._apiKey = apiKey;
    this._axios.defaults.headers.common["api-key"] = apiKey;
  }

  constructor() {
    this._apiKey = "";

    this._axios = axios.create({
      baseURL: "http://localhost:3000",
      // TODO: should we impose a more reasonable data limit?
      maxContentLength: Infinity
    });
  }
}
