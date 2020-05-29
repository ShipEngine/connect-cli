import axios, { AxiosInstance } from "axios";
import FormData from "form-data";
import { DeploymentStatusObj } from '../shipengine-core/utils/types';


/**
 * Add helper methods for ShipEngine API specific HTTP calls.
 */
export default class ShipengineAPIClient {
  private _apiKey: string;
  private _axios: AxiosInstance;

  public async deployApp(form: FormData, appName: string): Promise<string> {
    const response =  await this._axios.post(`/apps/${appName}/deploys`, form, {
      headers: form.getHeaders()
    })

    return response.data.deployId;
  }


  public async getDeploymentStatus(appName: string, deploymentID: string): Promise<DeploymentStatusObj> {
    let response = await this._axios.get(`/apps/${appName}/deploys/${deploymentID}`);

    return response.data as DeploymentStatusObj;
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
      baseURL: "http://localhost:3000/api",
      // TODO: should we impose a more reasonable data limit?
      maxContentLength: Infinity
    });

    // TODO: do we want to expose any call data via a debug flag?
    // this._axios.interceptors.request.use((request) => {
    //   console.log("Starting request", request);
    //   return request;
    // });
  }
}
