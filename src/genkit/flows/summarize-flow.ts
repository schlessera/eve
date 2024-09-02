// Import the Genkit core libraries and plugins.
import {defineFlow} from '@genkit-ai/flow'
import * as z from 'zod'
import {StreamingCallback} from '@genkit-ai/core'
import {promptRef} from '@genkit-ai/dotprompt'
import {PromptGenerateOptions} from '@genkit-ai/dotprompt/lib/prompt'
import {defineReadLocalFileTool} from '../tools/read-local-file'

// The entire flow definition needs to be contained within a function,
// in order to not immediately trigger it during OCLIF's command loading.
export function defineSummarizeFlow() {
  // Define a simple flow that prompts an LLM to summarize text.
  const summarizeFlow = defineFlow(
    {
      inputSchema: z.object({input: z.string(), additionalContext: z.optional(z.string()), length: z.number()}),
      name: 'summarizeFlow',
      streamSchema: z.string(),
    },
    async (
      {
        input,
        additionalContext,
        length,
      }: {
        input: string
        additionalContext?: string | undefined
        length: number
      },
      streamingCallback: StreamingCallback<string> | undefined,
    ) => {
      // Intercept console.log here, as the prompt loading produces debugging output for partials.
      const originalConsoleLog = console.log
      console.log = () => {}
      const summarizePrompt = await promptRef('summarize').loadPrompt()
      console.log = originalConsoleLog

      let context = ''
      if (additionalContext) {
        context =
          'The information between the following placeholders is additional context - consider it while creating the summary, but do not directly include it as the content to summarize: {{{ ' +
          additionalContext +
          ' }}}'
      }

      const readLocalFile = defineReadLocalFileTool()

      const options: PromptGenerateOptions = {
        model: 'googleai/gemini-1.5-flash-latest',
        input: {
          input: input,
          context: context,
          length: length,
        },
        tools: [readLocalFile],
      }

      if (streamingCallback) {
        const {response, stream} = await summarizePrompt.generateStream(options)

        for await (const chunk of stream()) {
          if (chunk.content[0].text) {
            streamingCallback(chunk.content[0].text)
          }
        }
        return (await response()).text()
      } else {
        const response = await summarizePrompt.generate(options)
        return response.text
      }
    },
  )
  return summarizeFlow
}
