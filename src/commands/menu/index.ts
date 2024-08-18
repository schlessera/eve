import {Args, Command} from '@oclif/core'

export default class Menu extends Command {
  static args = {
    theme: Args.string({description: 'Theme to suggest a menu for', required: true}),
  }

  static description = 'Suggest a menu based around a given theme'

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Menu)

    this.log(`Suggesting a menu around the theme of ${args.theme}:`)
    
  }
}
