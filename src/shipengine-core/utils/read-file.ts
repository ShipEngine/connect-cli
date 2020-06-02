import {
  EcmaScriptModule,
  ErrorCode,
} from "@shipengine/integration-platform-sdk";
import { promises as fs } from "fs";
import * as jsYaml from "js-yaml";
import * as json5 from "json5";
import * as path from "path";
import * as tsNode from "ts-node";
import { error as sdkError } from "@shipengine/integration-platform-sdk/lib/internal";

/**
 * Returns the contents of the specified UTF-8 text file
 */
async function readTextFile(filePath: string): Promise<string> {
  try {
    // tslint:disable-next-line: ban
    return fs.readFile(filePath, "utf8");
  } catch (error) {
    throw sdkError(ErrorCode.Filesystem, `Unable to read ${filePath}.`, {
      error,
    });
  }
}

/**
 * Returns the parsed contents of the specified YAML file
 */
async function readYamlFile<T>(filePath: string): Promise<T> {
  let yaml = await readTextFile(filePath);

  try {
    return jsYaml.safeLoad(yaml, { filename: path.basename(filePath) }) as T;
  } catch (error) {
    throw sdkError(
      ErrorCode.Syntax,
      `Unable to parse ${path.basename(filePath)}.`,
      { error },
    );
  }
}

/**
 * Returns the parsed contents of the specified JSON file
 */
async function readJsonFile<T>(filePath: string): Promise<T> {
  let json = await readTextFile(filePath);

  try {
    return json5.parse(json) as T;
  } catch (error) {
    throw sdkError(
      ErrorCode.Syntax,
      `Unable to parse ${path.basename(filePath)}.`,
      { error },
    );
  }
}

/**
 * Returns the default export of the specified JavaScript module
 */
async function importJavaScriptModule<T>(filePath: string): Promise<T> {
  try {
    let exports = (await import(filePath)) as EcmaScriptModule;
    if ("default" in exports) {
      // This appears to be an ECMAScript module, so return its default export
      return exports.default as T;
    } else {
      // This appears to be a CommonJS module, so return the module exports
      return (exports as unknown) as T;
    }
  } catch (error) {
    throw sdkError(
      ErrorCode.Filesystem,
      `Unable to import ${path.basename(filePath)}.`,
      { error },
    );
  }
}

// Ensures TS-Node is only registered once
let tsNodeRegistered = false;

/**
 * Returns the default export of the specified TypeScript module
 */
async function importTypeScriptModule<T>(filePath: string): Promise<T> {
  if (!tsNodeRegistered) {
    tsNodeRegistered = true;

    tsNode.register({
      // Don't do full type checking. Just transpile TS to JS.
      transpileOnly: true,

      // Don't search for a tsconfig.json. Just use the compilerOptions specified below.
      skipProject: true,

      // TypeScript compiler options
      compilerOptions: {
        // These options ensure compatibility with Node 10
        moduleResolution: "Node",
        module: "CommonJS",
        target: "ES2019",

        // Allow import JSON files
        resolveJsonModule: true,

        // Enable interoperability between CJS and ESM
        esModuleInterop: true,

        // Enable sourcemaps, so errors map to original source
        sourceMap: true,
      },
    });
  }

  // Once TS-Node is registered, TypeScript files can be imported just like JavaScript files
  return importJavaScriptModule(filePath);
}

/**
 * Reads a file based on its file extension
 */
export async function readFile<T>(filePath: string): Promise<T> {
  switch (path.extname(filePath)) {
    case ".yml":
    case ".yaml":
      return readYamlFile(filePath);

    case ".json":
    case ".jsonc":
    case ".json5":
      return readJsonFile(filePath);

    case ".js":
    case ".mjs":
      return importJavaScriptModule(filePath);

    case ".ts":
      return importTypeScriptModule(filePath);

    default:
      return (readTextFile(filePath) as unknown) as T;
  }
}
