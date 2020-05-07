import * as fs from "fs";
import * as fsExtra from "fs-extra";
import * as path from "path";
import { cliPrompt } from "./utils/cli-prompt";
import { fileExists } from "./utils/files";

/**
 * Create a new shipengine integration template
 */
export async function createTemplate(cwd?: string): Promise<void> {
  const createCwd = cwd ? cwd : process.cwd();

  const answers = await cliPrompt([
    {
      type: "input",
      name: "package-name",
      message: "What would you like to name your package?",
      default: "shipengine-app",
      validate: (value: string) => {
        const re = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
        const pass = value.match(re);

        if (pass) {
          return true;
        }

        return "Please enter a valid npm package name (ex: shipengine-app)";
      },
    },
    {
      type: "input",
      name: "package-description",
      message: "Would you like to give your package a description?",
    },
    {
      type: "input",
      name: "package-author",
      message: "Who is the author of this package?",
      validate: (value: string) => {
        if (value.length > 0) {
          return true;
        }
        return "Please enter a package author.";
      },
    },
    {
      type: "list",
      name: "app-type",
      message: "What type of app would you like to build?",
      choices: ["carrier"],
      // choices: ["carrier", "order-source"],
      default: "carrier",
    },
    {
      type: "list",
      name: "package-manager",
      message: "What package manager would you like to use?",
      choices: ["npm", "yarn"],
      default: "npm",
    },
    {
      type: "list",
      name: "package-language",
      message: "What language would you like to use?",
      choices: ["TypeScript", "Javascript"],
      default: "TypeScript",
    },
    {
      type: "confirm",
      name: "lint-package",
      message: "Would you like to use eslint for TypeScript and Javascript?",
      default: true,
    },
    {
      type: "confirm",
      name: "test-package",
      message: "Would you like to test your package with mocha (recommended)?",
      default: true,
    },
  ]);

  const packageName = answers["package-name"] as string;
  const packageDescription = answers["package-description"] as string;
  const packageAuthor = answers["package-author"] as string;
  const appType = answers["app-type"] as string;
  const packageManager = answers["package-manager"] as string;
  const packageLanguage = answers["package-language"] as string;
  const lintPackage = answers["lint-package"] as boolean;
  const testPackage = answers["test-package"] as boolean;

  const templatePath = path.join(
    __dirname,
    "templates",
    `${appType}-${packageLanguage}`,
  );

  const newPackagePath = path.join(createCwd, packageName);
  const packageExists = await fileExists(newPackagePath);

  if (!packageExists) {
    await fs.promises.mkdir(newPackagePath);
    await fsExtra.copy(templatePath, newPackagePath);

    const templatePjson = await fs.promises.readFile(
      path.join(newPackagePath, "package.json"),
      "utf-8",
    );

    let updatedPjson: string;

    updatedPjson = templatePjson.replace(/<PACKAGE_NAME>/g, packageName);
    updatedPjson = updatedPjson.replace(
      /<PACKAGE_DESCRIPTION>/g,
      packageDescription,
    );
    updatedPjson = updatedPjson.replace(/<PACKAGE_AUTHOR>/g, packageAuthor);

    await fs.promises.writeFile(
      path.join(newPackagePath, "package.json"),
      updatedPjson,
      "utf-8",
    );

    // TODO: uncomment this once the package is publicly available, there's some weird linking issues.
    // execSync("npm install", { cwd: newPackagePath });
  } else {
    throw new Error(`A directory with the name ${packageName} already exists.`);
  }
}
