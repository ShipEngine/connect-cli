import * as path from "path";
import * as fs from "fs";
import axios from "axios";

export async function deployApp(packageTarballlName: string) {

  // Get the app id
  let rcFile = await fs.promises.readFile(path.join(process.cwd(), ".integrationrc"), "utf-8");
  // at this point in the publish command the existence of the "id" property has already occurred
  let rcJSON = JSON.parse(rcFile) as {id: string};
  let appID = rcJSON.id;

  // Find the tarball
  const tarPath = path.join(process.cwd(), packageTarballlName);
  console.log(packageTarballlName);

  const tarBallBuffer = await fs.promises.readFile(tarPath);
  let data = new FormData();
  data.append("deployment", new Blob([tarBallBuffer], {type: "application/gzip"}));

  // const deploymentResponse = axios.post(`apps/${appID}/deploys`, data);

}