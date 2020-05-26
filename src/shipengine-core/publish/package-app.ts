import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import util from "util";

const asyncExec = util.promisify(exec);

export async function packageApp(): Promise<string> {

  const packagePath = path.join(process.cwd(), "package.json");

  const results = await fs.promises.readFile(packagePath, "utf-8");
  const pjson = JSON.parse(results);

  // take dependencies and move them to bundledDependencies
  pjson.bundledDependencies = [];

  for (let dependency of Object.keys(pjson.dependencies)) {
    pjson.bundledDependencies.push(dependency);
  }

  await fs.promises.writeFile(packagePath, JSON.stringify(pjson, undefined, 2));

  const { stdout } = await asyncExec("npm pack");

  return stdout.trim();
}