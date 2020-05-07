import BaseCommand from "../../base-command";
import { flags } from "@oclif/command";
import { createEnv } from "yeoman-environment";
// import { createTemplate } from "../../shipengine-core/create-template";

export default class New extends BaseCommand {
  static description =
    "create a new package to develop a custom ShipEngine app";

  static args = [
    {
      name: "path",
      required: false,
      description: "path to package (defaults to current directory)",
    },
  ];

  static flags = {
    force: flags.boolean({
      description: "overwrite existing files",
    }),
    help: flags.help({ char: "h" }),
  };

  static examples = ["$ shipengine apps:new"];

  async run() {
    const { flags, args } = this.parse(New);
    const env = createEnv();
    env.register(require.resolve("../../generators/apps-new"), "apps:new");

    const generatorOptions = {
      path: args.path,
      force: flags.force,
    };

    await new Promise((resolve, reject) => {
      env.run("apps:new", generatorOptions, (err: Error | null) => {
        if (err) reject(err);
        else resolve("done");
      });
    });
  }
}
