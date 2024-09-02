import {streamFlow} from '@genkit-ai/flow'
import {Args, Command, Flags} from '@oclif/core'

import {initializeGenKit} from '../genkit'
import {defineSummarizeFlow} from '../genkit/flows/summarize-flow'

export default class Summarize extends Command {
  static args = {
    input: Args.string({description: 'Input to summarize', required: true}),
    additionalContext: Args.string({
      description: 'Additional context to consider when summarizing the input',
      required: false,
    }),
  }

  static description: string = 'Summarize a given input'

  static flags = {
    length: Flags.integer({default: 30, description: 'Length of the summarization in words', required: false}),
  }

  public async run(): Promise<void> {
    const {args, flags}: {args: {input: string; additionalContext: string | undefined}; flags: {length: number}} =
      await this.parse(Summarize)

    await initializeGenKit(false)
    const summarizeFlow = defineSummarizeFlow()
    const response = await streamFlow(summarizeFlow, {
      input: args.input,
      additionalContext: args.additionalContext,
      length: flags.length,
    })
    for await (const chunk of response.stream()) {
      if (typeof chunk === 'string') {
        process.stdout.write(chunk)
      }
    }
  }
}
