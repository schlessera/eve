import {streamFlow} from '@genkit-ai/flow'
import {Args, Command} from '@oclif/core'

import {initializeGenKit} from '../genkit'
import {defineChatFlow} from '../genkit/flows/chat-flow'
import { ZodArray } from 'zod'

export default class Chat extends Command {
  static args = {
    message: Args.string({description: 'Message to send to the chatbot', required: true}),
  }

  static strict: boolean = false

  static description: string = 'Chat with EVE as a chatbot'

  public async run(): Promise<void> {

    const {argv} = await this.parse(Chat)
    // We use all remaining positional arguments as the message.
    const args = {message: argv.join(' ')}
    await initializeGenKit(false)
    const chatFlow = defineChatFlow()
    const response = await streamFlow(chatFlow, {message: args.message})
    for await (const chunk of response.stream()) {
      if (typeof chunk === 'string') {
        process.stdout.write(chunk)
      }
    }
  }
}
