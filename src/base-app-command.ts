import {loadApp} from '@shipengine/connect-loader';
import BaseCommand from "./base-command";
import APIClient, {ApiClientErrors} from "./core/api-client";
import {ConnectApp} from "./core/types";
import Login from "./commands/login";
import {flags} from '@oclif/command';

/**
 * Base class for commands that operate on an existing app with a logged in user
 */
export default abstract class AppBaseCommand extends BaseCommand {

  static flags = {
    debug: flags.boolean({
      char: "d",
      description: "Show network debugging information",
      default: false,
      hidden: true
    }),
  }

  protected client?: APIClient;

  protected platformApp?: ConnectApp;

  async init(): Promise<void> {

    // @ts-ignore
    const {flags} = this.parse(this.constructor);

    try {

      // @ts-ignore
      await this.getCurrentUser(flags.debug);
    } catch {
      await Login.run([]);
    }
    try {
      const pathToApp = process.cwd();
      const app = await loadApp(pathToApp);

      // @ts-ignore
      this.client = await this.apiClient(flags.debug);
      this.platformApp = await this.client.apps.getByName(app.manifest.name);
    } catch (error) {
      switch (error.code) {
        case "ERR_APP_ERROR":
          return this.error("Error loading your app - please make sure you are in an app directory", {
            exit: 1,
          });
        case ApiClientErrors.NotFound:
          return this.error("This app has not been published yet", {
            exit: 1,
          });
        default:
          return this.error("Error initializing app", {
            exit: 1,
          });
      }
    }
  }

}
