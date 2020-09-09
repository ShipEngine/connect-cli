/* eslint-disable unicorn/no-abusive-eslint-disable */

interface PJson {
  name: string;
  version: string;
  description?: string;
  dependencies: Record<string, string>;
}

export default function getVersions(): Record<string, string> {
  // We have to use `require()` here instad of `import`
  // because the "package.json" file is outside of the "src" directory.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
  const cliPjson = require("../../../package.json") as PJson;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
  const sdkPjson = require("@shipengine/connect-sdk/package.json") as PJson;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
  const loaderPjson = require("@shipengine/connect-loader/package.json") as PJson;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
  const localDevApiPjson = require("@shipengine/connect-local-dev-api/package.json") as PJson;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
  const localDevUiPjson = require("@shipengine/connect-local-dev-ui/package.json") as PJson;

  return {
    "node": process.version,
    "@shipengine/connect-cli": cliPjson.version,
    "@shipengine/connect-sdk": sdkPjson.version,
    "@shipengine/connect-loader": loaderPjson.version,
    "@shipengine/connect-local-dev-api": localDevApiPjson.version,
    "@shipengine/connect-local-dev-ur": localDevUiPjson.version
  }
}
