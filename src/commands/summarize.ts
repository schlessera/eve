import { runFlow } from '@genkit-ai/flow';
import { Args, Command } from '@oclif/core';

import { initializeGenKit } from '../genkit';
import { summarizeFlow } from '../genkit/summarize-flow';

export default class Summarize extends Command {
  static args = {
    target: Args.string({ description: 'Target to summarize', required: true }),
  };

  static description: string = 'Summarize a given target';

  public async run(): Promise<void> {
    const { args }: { args: { target: string } } = await this.parse(Summarize);

    await initializeGenKit(false);
    const response: string = await runFlow(summarizeFlow, args.target);
    this.log(response);
  }
}
