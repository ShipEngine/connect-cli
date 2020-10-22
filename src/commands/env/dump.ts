import {flags} from "@oclif/command";
import AppBaseCommand from "../../base-app-command";

export default class Dump extends AppBaseCommand {
  static description = "Dump environment variables for an app in dotenv KEY=VALUE format";

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
      configurationKeys.forEach(key => {
        this.log(`${key.name}=${key.value}`);
      });

    } catch (error) {
      return this.error("Error retrieving environment variables", {
        exit: 1,
      });
    }
  }
}
