import BaseCommand from "../base-command";
import getVersions from '../core/utils/get-versions';

export default class Versions extends BaseCommand {
  // hide the command from help
  public static hidden = true;

  async run(): Promise<void> {
    return Object.entries(getVersions()).forEach(([key, value]: [string, string]) => this.log(`${key} ${value}`))
  }
}
