import {Command, flags} from "@oclif/command"
import { createTemplate } from '../../shipengine-core/create-template'

export default class New extends Command {
  static description = "create a new project to develop a custom ShipEngine integration"

  static flags = {
    help: flags.help({char: "h"}),
  }

  // static args = [
  //   {name: "new"}
  // ]


  static examples = [
    "integration new",
  ]

  async run() {
    // const {args, flags} = this.parse(New)
    createTemplate()
  }
}
