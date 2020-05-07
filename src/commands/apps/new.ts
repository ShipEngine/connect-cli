import BaseCommand from "../../base-command";
import { flags } from "@oclif/command";
import { createEnv } from "yeoman-environment";
// import { createTemplate } from "../../shipengine-core/create-template";

export default class New extends BaseCommand {
  static description =
    "create a new project to develop a custom ShipEngine app";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static examples = ["$ shipengine apps:new"];

  async run() {
    const { flags, args } = this.parse(New);
    // const options = flags.options ? flags.options.split(",") : [];

    await this.generate({
      // type: this.type,
      // path: args.path,
      // options,
      // defaults: flags.defaults,
      // force: flags.force,
    });
  }

  private async generate(generatorOptions: object = {}) {
    const env = createEnv();

    env.register(require.resolve("../../generators/apps-new"), "apps:new");

    await new Promise((resolve, reject) => {
      env.run("apps:new", generatorOptions, (err: Error, results: any) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }
}
