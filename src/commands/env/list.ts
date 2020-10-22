import {flags} from "@oclif/command";
import Table from 'cli-table';
import AppBaseCommand from "../../base-app-command";
import {green} from "colors";

export default class List extends AppBaseCommand {
  static description = "List environment variables for an app";

  static flags = {
    ...AppBaseCommand.flags,
    help: flags.help({
      char: "h",
      description: "show help for the env command",
    })
  };

  async run(): Promise<void> {

    if (!(this.client && this.platformApp)) {
      this.error("Initialization failed - invalid state");
      return;
    }

    try {
      const configurationKeys = await this.client.configuration.list(this.platformApp.id);

      if (!(configurationKeys && configurationKeys.length > 0)) {
        this.log(`${this.platformApp.name} has no environment variables set`)
        return;
      }
      const table = new Table({
        head: [
          green('Name'),
          green("Value")
        ]
      });
      configurationKeys.forEach(key => {
        table.push([key.name, key.value]);
      });
      this.log(table.toString());

    } catch (error) {
      return this.error("Error retrieving environment variables", {
        exit: 1,
      });
    }
  }
}
