import {flags} from "@oclif/command";
import AppBaseCommand from "../../base-app-command";

export default class Set extends AppBaseCommand {
  static description = "Set an environment variable for an app";

  static flags = {
    ...AppBaseCommand.flags,
    help: flags.help({
      char: "h",
      description: "show help for the env command",
    })
  };

  static parseInput(input: string): { name: string, value: string } {
    const tokens = input.split("=");
    if (tokens.length !== 2) {
      throw new Error("Invalid format of NAME=value.");
    }
    if (!(tokens[0] && tokens[1])) {
      throw new Error("Invalid format of NAME=value. NAME and value must not be empty");
    }
    return {
      name: tokens[0].toUpperCase(),
      value: tokens[1]
    };
  }


  static args = [
    {
      name: "NAME=value",
      description: "the environment variable name=value. e.g. FOO=bar (note: name will always be UpperCased)",
      required: true,
      parse: Set.parseInput
    }
  ]

  async run(): Promise<void> {

    if (!(this.client && this.platformApp)) {
      this.error("Initialization failed - invalid state");
      return;
    }

    const {args} = this.parse(Set);

    const nameValue = args["NAME=value"];

    try {
      const configurationKey = await this.client.configuration.set(this.platformApp.id, nameValue);
      this.log(`${configurationKey.name}=${configurationKey.value} has been set.`);
    } catch (error) {
      return this.error("Error setting environment variable", {
        exit: 1,
      });
    }
  }
}
