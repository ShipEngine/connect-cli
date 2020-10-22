import {flags} from "@oclif/command";
import AppBaseCommand from "../../base-app-command";

export default class UnSet extends AppBaseCommand {
  static description = "UnSet (delete) an environment variable from an app";

  static flags = {
    ...AppBaseCommand.flags,
    help: flags.help({
      char: "h",
      description: "show help for the env command",
    })
  };

  static args = [
    {
      name: "NAME",
      description: "the environment variable name. e.g. FOO (note: name will always be UpperCased)",
      required: true,
      parse: (input: string) => input.toUpperCase()
    }
  ]

  async run(): Promise<void> {

    if (!(this.client && this.platformApp)) {
      this.error("Initialization failed - invalid state");
      return;
    }

    const {args} = this.parse(UnSet);

    const name = args.NAME;

    try {
      const configurationKeys = await this.client.configuration.list(this.platformApp.id);
      if(configurationKeys.filter(key => key.name === name).length === 0){
        this.warn(`${name} does not exist as an environment variable for this app.`);
        return;
      }

      await this.client.configuration.unset(this.platformApp.id, name);
      this.log(`${name} has been removed as an environment variable.`)
    } catch (error) {
      return this.error("Error unsetting the environment variable", {
        exit: 1,
      });
    }
  }
}
