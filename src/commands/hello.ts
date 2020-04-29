import { Command, flags } from "@oclif/command";

export default class Hello extends Command {
  async run() {
    const { args, flags } = this.parse(Hello);

    const name = flags.name || "world";
    this.log(`hello ${name} from ./src/commands/hello.ts`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}

Hello.description = "describe the command here";

Hello.examples = [
  `$ shipengine hello
hello world from ./src/hello.ts!
`,
];

Hello.flags = {
  help: flags.help({ char: "h" }),
  // flag with a value (-n, --name=VALUE)
  name: flags.string({ char: "n", description: "name to print" }),
  // flag with no value (-f, --force)
  force: flags.boolean({ char: "f" }),
};

Hello.args = [{ name: "file" }];
