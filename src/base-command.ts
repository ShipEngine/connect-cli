import { Command as Base } from "@oclif/command";
import ShipengineAPIClient from "./core/shipengine-api-client";
// import { User } from "./core/types";
// import APIClient from "./api-client";

const pjson = require("../package.json");

export default abstract class BaseCommand extends Base {
  base = `${pjson.name}@${pjson.version}`;
  private _client!: ShipengineAPIClient;

  // get client(): ShipengineAPIClient {
  //   if (this._client) return this._client;
  //   this._client = new ShipengineAPIClient();
  //   return this._client;
  // }

  // async currentUser(): Promise<User> {

  // }
}
