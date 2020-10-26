import {flags} from "@oclif/command";
import AppBaseCommand from "../../base-app-command";
import {ConfigurationKey, EnvironmentType} from "../../core/types/configuration-key";

export default class Set extends AppBaseCommand {
  static description = "Set environment variables for an app";

  static strict = false;

  static aliases = ['set'];

  static flags = {
    ...AppBaseCommand.flags,
    help: flags.help({
      char: "h",
      description: "show help for the env command",
    })
  };

  static parseInput(input: string): ConfigurationKey {
    const tokens = input.split("=");
    if (tokens.length !== 2) {
      throw new Error("Invalid format of NAME=value.");
    }
    if (!(tokens[0] && tokens[1])) {
      throw new Error("Invalid format of NAME=value. NAME and value must not be empty");
    }
    return {
      name: tokens[0].toUpperCase(),
      value: tokens[1],
      environmentType: EnvironmentType.dev // change when introducing env-type to CLI
    };
  }


  static args = [
    {
      name: "NAME-1=value ... NAME-N=value",
      description: "the environment variable(s) name=value. e.g. FOO=bar (note: name will always be UPPERCASED)",
      required: true,
    }
  ]

  async run(): Promise<void> {

    if (!(this.client && this.platformApp)) {
      this.error("Initialization failed - invalid state");
      return;
    }

    const configurationKeys = this.argv.map(a => {
      return Set.parseInput(a);
    });

    for (const key of configurationKeys) {
      try {
        const configurationKey = await this.client.configuration.set(this.platformApp.id, key);
        this.log(`${configurationKey.name}=${configurationKey.value} has been set.`);
      } catch (error) {
        this.error("Error setting environment variable", {
          exit: 1,
        });
      }
    }
  }
}
