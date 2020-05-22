import BaseCommand from "../../base-command";
import { verifyRCFile } from '../../shipengine-core/publish/verify-rc-file';
import { packageApp } from '../../shipengine-core/publish/package-app';
import { deployApp } from '../../shipengine-core/publish/deploy-app';

export default class Publish extends BaseCommand {
  static description = "publish your app";

  static examples = ["$ shipengine apps:publish"];

  // hide the command from help
  static hidden = true;

  async run() {
    await verifyRCFile();
    const tarballName = await packageApp();
    await deployApp(tarballName);
  }
}
