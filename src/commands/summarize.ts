import { runFlow } from '@genkit-ai/flow';
import { Args, Command, Flags } from '@oclif/core';

import { initializeGenKit } from '../genkit';
import { summarizeFlow } from '../genkit/summarize-flow';

export default class Summarize extends Command {
  static args = {
    input: Args.string({ description: 'Input to summarize', required: true }),
  };

  static description: string = 'Summarize a given input';

  static flags = {
    length: Flags.integer({ default: 30, description: 'Length of the summarization in words', required: false }),
  };

  public async run(): Promise<void> {
    const { args, flags }: { args: { input: string }; flags: { length: number } } = await this.parse(Summarize);

    await initializeGenKit(false);
    const response: string = await runFlow(summarizeFlow, { input: args.input, length: flags.length });
    this.log(response);
  }
}
