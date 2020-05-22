import * as fs from "fs";

type IntegrationRC = {
  id?: string, 
  name?: string
}

export async function lintRCFile() {

  const rcFile = await fs.promises.readFile(".integrationrc", "utf-8");
  const rcJSON = JSON.parse(rcFile) as IntegrationRC;

  // Check for expected properties, currently only "id"
  if(!rcJSON.id) {
    throw new Error(".integrationrc is missing the 'id' property");
  }

  if(!/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(rcJSON.id)) {
    throw new Error("id property in the .integrationrc file is not a valid version 4 UUID");
  }

}