import { loadApp, App } from "@shipengine/integration-platform-loader";
import * as path from "path";
import readdir from "recursive-readdir";
import { runTest } from './test-harness/run-test';

export const testSuites = ["create-shipment", "rate-shipment", "schedule-pickup"];

export class InvalidAppError extends Error {
  errors: string[];

  constructor(message: string, errors: string[]) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.name = InvalidAppError.name; // stack traces display correctly now
    this.errors = errors;
  }
}

function isError(error: string): boolean {
  const nonErrorChecks = [
    /Error loading the ShipEngine Integration Platform app:/,
    /Invalid ShipEngine Integration Platform/,
  ];

  return !nonErrorChecks.some((regex) => {
    return error.match(regex);
  });
}

// TODO - handle following
// Make sure the cwd has a package.json file
//  ›   Error: Error: Cannot find module '/Users/pierce/package.json'
//  ›   Require stack: ...

// Make sure there is a local installation of the SDK
//  ›   Error: Looks like you're missing a local installation of
//  ›   @shipengine/integration-platform-sdk. Run `npm install` to resolve
export async function validateApp(pathToApp: string): Promise<App> {
  try {
    const app = await loadApp(pathToApp);
    return app;
  } catch (error) {
    const errors: string[] = error.message
      .split(/\r?\n/)
      .filter((errorLine: string) => {
        return isError(errorLine);
      })
      .map((errorLine: string) => {
        return errorLine.trim();
      });

    return Promise.reject(new InvalidAppError(error.message, errors));
  }
}

export async function validateTestSuite(app: App, argv: string[]): Promise<void> {

  if (argv[0]) {
    process.env["TEST-SUITE"] = argv[0];
  }

  if (argv[1]) {
    process.env["TEST-NUMBER"] = argv[1];
  }

  // Find all defined methods.
  const carrierAppMethods = ["createShipment", "cancelShipments", "rateShipment", "track", "createManifest", "schedulePickup", "cancelPickup"];
  const appMethods: string[] = [];

  if (app.type === "carrier") {
    for (let carrierMethod of carrierAppMethods) {
      if (Reflect.get(app.carrier, carrierMethod)) {
        appMethods.push(carrierMethod);
      }
    }
  }
  else if (app.type === "connection") {
    if (Reflect.get(app.connection, "connect")) {
      appMethods.push("connect");
    }
  }

  // Map method names to the corresponding test suites
  const testSuiteMap: Record<string, string> = {
    "createShipment": "create-shipment",
    "cancelShipments": "cancel-shipments",
    "rateShipment": "rate-shipment",
    "track": "track",
    "createManifest": "create-manifest",
    "schedulePickup": "schedule-pickup",
    "cancelPickup": "cancel-pickup",
    "connect": "connect"
  }

  const testDir = path.join(__dirname, "test-harness", "tests");

  // Add each .ts file to the test instance
  const files = await readdir(testDir);

  const filteredFiles = files
    .filter((file) => {
      // Only keep the .ts files
      return file.substr(-3) === '.ts';
    })
    .filter((file) => {

      // If the user specified a test suite then only return that sub-directory
      if (argv[0]) {
        if (file.includes(argv[0])) {
          return file;
        }
      }
      else {
        // Only add method test suites that are defined in the Integration App that is being tested.
        for (let appMethod of appMethods) {
          if (file.includes(testSuiteMap[appMethod])) {
            // Checke to make sure 
            return file;
          }
        }
      }
    });

    await runTest(app, filteredFiles);
}
