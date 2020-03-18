import { Options, Settings } from "./settings";

import { createTemplate } from "@shipengine/ipaas";
import { ExitCode } from "./cli/exit-code";
import { ipaasHelpText } from "./cli/help/ipaas-help";

/**
 * CLI for using public ShipEngine services
 *
 * @returns - Options
 */
export async function shipengine(options?: Options): Promise<void> {
  let settings = new Settings(options);

  if (settings.ipaas) {
    if (settings.ipaas.new) {
      await createTemplate();
    }
    else if (settings.ipaas.help) {
      // Show the help text and exit
      console.log(ipaasHelpText);
      process.exit(ExitCode.Success);
    }
  }
}
