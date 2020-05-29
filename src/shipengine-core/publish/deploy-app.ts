import { loadApp } from "@shipengine/integration-platform-loader";

import * as path from "path";
import * as fs from "fs";
import FormData from "form-data";
import APIClient from '../../api-client';

/**
 * Takes an npm package tarball and uploads it via a multipart/form-data to the integration platform.
 */
export async function deployApp(packageTarballlName: string, apiClient: APIClient): Promise<[string, string]> {

  // load app to retrieve the carrier id.
  const app = await loadApp(process.cwd());

  // Find the tarball
  const tarPath = path.join(process.cwd(), packageTarballlName);

  // send the id, name, type, and tarball package
  let form = new FormData();
  
  form.append("deployment", fs.createReadStream(tarPath));
  // form.append("name", app.manifest.name );
  // form.append("type", app.type);
  // form.append("version", app.manifest.version);

  const deploymentID = await apiClient.deployApp(form, app.manifest.name);

  return [deploymentID, app.manifest.name];
}