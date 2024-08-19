// Import the Genkit core libraries and plugins.
import { generateStream } from '@genkit-ai/ai';
import { defineFlow } from '@genkit-ai/flow';
import { gemini15Flash } from '@genkit-ai/googleai';
import * as z from 'zod';
import { readLocalFile } from '../tools/read-local-file';
import { StreamingCallback } from '@genkit-ai/core';

// Define a simple flow that prompts an LLM to summarize text.
export const summarizeFlow = defineFlow(
  {
    inputSchema: z.object({ input: z.string(), length: z.number() }),
    name: 'summarizeFlow',
    streamSchema: z.string(),
  },
  async ({ input, length }: { input: string; length: number }, streamingCallback: StreamingCallback<string> | undefined) => {
    if (!streamingCallback) {
      throw new Error('this flow only works in streaming mode');
    }    

    // Construct a request and send it to the model API.
    const { response, stream } = await generateStream({
      config: {
        temperature: 1,
      },
      model: gemini15Flash,
      tools: [readLocalFile],
      prompt: `I want you to summarize a piece of text I provide. Don't explain your reasoning, just produce the final summarized output. The target length of the summary is ${length} words. If the input looks like a filename, assume it is on the local filesystem and read its contents to summarize that content. Input: ${input}`,
    });

    for await (const chunk of stream()) {
      if (chunk.content[0].text) {
        streamingCallback(chunk.content[0].text);
      }
    }
    return (await response()).text();
  }
);
