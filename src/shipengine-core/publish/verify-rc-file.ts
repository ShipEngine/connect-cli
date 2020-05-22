import * as fs from "fs";
import * as path from "path";
import inquirer from 'inquirer';
import { lintRCFile } from './lint-rc-file';
import { fileExists } from '../utils/file-exists';

export async function verifyRCFile() {

  // let results = await checkForFiles();

  let rcExists = await fileExists(path.join(process.cwd(), ".integrationrc"));
  let pJsonExists = await fileExists(path.join(process.cwd(), "package.json"));

  if (pJsonExists && !rcExists) {
    // start inquirer to create one
    await createRCFile();
  }
  else if (pJsonExists && rcExists) {
    await lintRCFile();
  }
  else {
    console.error("Error: You don't seem to be in the root directory of your project");
  }
}

async function createRCFile() {
  const createRCAnswer = await inquirer.prompt([
    {
      type: "confirm",
      name: "createRC",
      message: "It looks like you don't have a .integrationrc file in your project. Would you like us to create you one?",
      default: true
    }
  ]);

  if (createRCAnswer["createRC"]) {
    const answers = await inquirer.prompt([
      {
        type: "confirm",
        name: "createAppID",
        message: "Great! Would you like us to generate an App ID?",
        default: true
      }
    ]);

    await createIntegrationRCFile(answers["createAppID"]);
  }
}

async function createIntegrationRCFile(createID: boolean) {

  const appContents: { id?: string } = {};

  if (createID) {
    // TODO: HTTP request to create new app ID.
    appContents.id = "134c8258-3169-4411-b5d8-4ae8b0bf55a4";
  }

  await fs.promises.writeFile(".integrationrc", JSON.stringify(appContents, undefined, 2));
}