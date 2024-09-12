// Import the Genkit core libraries and plugins.
import { defineFlow } from '@genkit-ai/flow'
import * as z from 'zod'
import { StreamingCallback } from '@genkit-ai/core'
import { promptRef } from '@genkit-ai/dotprompt'
import { PromptGenerateOptions } from '@genkit-ai/dotprompt/lib/prompt'
import { ChatHistory } from '../../utils/chatHistory'

// The entire flow definition needs to be contained within a function,
// in order to not immediately trigger it during OCLIF's command loading.
export function defineChatFlow() {
  // Define a simple flow that prompts an LLM to summarize text.
  const chatFlow = defineFlow(
    {
      inputSchema: z.object({ message: z.string() }),
      name: 'chatFlow',
      streamSchema: z.string(),
    },
    async (
      {
        message,
      }: {
        message: string
      },
      streamingCallback: StreamingCallback<string> | undefined,
    ) => {
      // Intercept console.log here, as the prompt loading produces debugging output for partials.
      const originalConsoleLog = console.log
      console.log = () => { }
      const chatPrompt = await promptRef('chat').loadPrompt()
      console.log = originalConsoleLog

      const chatHistory = new ChatHistory()
      await chatHistory.load()

      const options: PromptGenerateOptions = {
        model: 'googleai/gemini-1.5-flash-latest',
        input: {
          message: message,
        },
        history: chatHistory.getHistory(),
      }

      // We need to store the message as well as its response in history.
      let historyBuffer = ''
      if (streamingCallback) {
        const { response, stream } = await chatPrompt.generateStream(options)

        for await (const chunk of stream()) {
          if (chunk.content[0].text) {
            historyBuffer += chunk.content[0].text
            streamingCallback(chunk.content[0].text)
          }
        }
        const fullResponse = (await response()).text()
        chatHistory.addMessage('user', message)
        chatHistory.addMessage('model', fullResponse)
        await chatHistory.save()
        return fullResponse
      } else {
        const response = await chatPrompt.generate(options)
        chatHistory.addMessage('user', message)
        chatHistory.addMessage('model', response.text())
        await chatHistory.save()
        return response.text()
      }
    },
  )
  return chatFlow
}
