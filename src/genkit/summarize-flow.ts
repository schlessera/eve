// Import the Genkit core libraries and plugins.
import { generate } from '@genkit-ai/ai';
import { defineFlow } from '@genkit-ai/flow';
import { gemini15Flash } from '@genkit-ai/googleai';
import * as z from 'zod';

// Define a simple flow that prompts an LLM to summarize text.
export const summarizeFlow = defineFlow(
  {
    inputSchema: z.string(),
    name: 'summarizeFlow',
    streamSchema: z.string(),
  },
  async (target: string) => {
		// Construct a request and send it to the model API.
    const llmResponse = await generate({
      config: {
        temperature: 1,
      },
      model: gemini15Flash,
      prompt: `I want you to summarize a piece of text I provide. Don't explain your reasoning, just produce the final summarized output. The target length of the summary is 30 words. Here's the text: ${target}`,
    });

	  // Handle the response from the model API. In this sample, we just convert
    // it to a string, but more complicated flows might coerce the response into
    // structured output or chain the response into another LLM call, etc.
    return llmResponse.text();
  }
);

