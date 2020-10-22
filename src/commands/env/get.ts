import {flags} from "@oclif/command";
import Table from 'cli-table';
import AppBaseCommand from "../../base-app-command";

export default class Get extends AppBaseCommand {
  static description = "Get environment variables for an app";

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
    const {args} = this.parse(Get);

    const name = args.NAME;

    try {
      const configurationKeys = await this.client.configuration.list(this.platformApp.id);

      if (!(configurationKeys && configurationKeys.length > 0)) {
        this.log(`${this.platformApp.name} has no environment variables set`)
        return;
      }
      const table = new Table({head: ['Name', "Value"]});
      configurationKeys.filter(key => key.name === name).forEach(key => {
        table.push([key.name, key.value]);
      });
      if (table.length >= 1) {
        this.log(table.toString());
      } else {
        this.warn(`${name} does not exist`);
      }

    } catch (error) {
      return this.error("Error retrieving environment variables", {
        exit: 1,
      });
    }
  }
}
