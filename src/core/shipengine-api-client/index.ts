// import axios, { AxiosInstance } from "axios";
// import FormData from "form-data";
// import { DeploymentStatusObj } from "../types";

// /**
//  * Add helper methods for ShipEngine API specific HTTP calls.
//  */
// export default class ShipengineAPIClient {
//   private _apiKey: string;
//   private _axios: AxiosInstance;

//   constructor() {
//     this._apiKey = "";

//     this._axios = axios.create({
//       baseURL: "https://dip-webapi-dev.kubedev.sslocal.com/api",
//       maxContentLength: Infinity,
//     });
//   }

//   protected get apiKey(): string {
//     return this._apiKey;
//   }

//   protected set apiKey(apiKey: string) {
//     this._apiKey = apiKey;
//     this._axios.defaults.headers.common["api-key"] = apiKey;
//   }
// }
