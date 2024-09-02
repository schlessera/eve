// Import the Genkit core libraries and plugins.
import {defineFlow} from '@genkit-ai/flow'
import * as z from 'zod'
import {StreamingCallback} from '@genkit-ai/core'
import {promptRef} from '@genkit-ai/dotprompt'
import {PromptGenerateOptions} from '@genkit-ai/dotprompt/lib/prompt'
import path from 'path'
import fs from 'fs'

// The entire flow definition needs to be contained within a function,
// in order to not immediately trigger it during OCLIF's command loading.
export function defineChatFlow() {
  // Define a simple flow that prompts an LLM to summarize text.
  const chatFlow = defineFlow(
    {
      inputSchema: z.object({message: z.string()}),
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
      console.log = () => {}
      const chatPrompt = await promptRef('chat').loadPrompt()
      console.log = originalConsoleLog

      // History is stored as JSON in ~/.eve/chat-history.json and rotates every 1000 messages.
      let history = []

      const historyFile = path.join(process.env.HOME || '~', '.eve/chat-history.json')
      const historyFileExists = fs.existsSync(historyFile)
      if (historyFileExists) {
        try {
          history = JSON.parse(fs.readFileSync(historyFile, 'utf8'))
        } catch (error) {
          console.error(`Error reading chat history: ${error}`)
          history = []
        }
      } else {
        try {
          // Check for the directory and create it if it doesn't exist.
          const historyDir = path.dirname(historyFile)
          if (!fs.existsSync(historyDir)) {
            fs.mkdirSync(historyDir, {recursive: true})
          }
          // Create the file with an empty array.
          fs.writeFileSync(historyFile, JSON.stringify([]), 'utf8')
        } catch (error) {
          console.error(`Error creating chat history: ${error}`)
        }
        history = []
      }

      const options: PromptGenerateOptions = {
        model: 'googleai/gemini-1.5-flash-latest',
        input: {
          message: message,
        },
        history: history,
      }

      // We need to store the message as well as its response in history.
      let historyBuffer = ''
      if (streamingCallback) {
        const {response, stream} = await chatPrompt.generateStream(options)

        for await (const chunk of stream()) {
          if (chunk.content[0].text) {
            historyBuffer += chunk.content[0].text
            streamingCallback(chunk.content[0].text)
          }
        }
        const fullResponse = (await response()).text()
        history.push({role: 'user', content: [{text: message}]})
        history.push({role: 'model', content: [{text: fullResponse}]})
        // Rotate history if it exceeds 1000 messages
        if (history.length > 1000) {
          history = history.slice(-1000)
        }
        fs.writeFileSync(historyFile, JSON.stringify(history), 'utf8')
        return fullResponse
      } else {
        const response = await chatPrompt.generate(options)
        history.push({role: 'user', content: [{text: message}]})
        history.push({role: 'model', content: [{text: response.text}]})
        // Rotate history if it exceeds 1000 messages
        if (history.length > 1000) {
          history = history.slice(-1000)
        }
        fs.writeFileSync(historyFile, JSON.stringify(history), 'utf8')
        return response.text
      }
    },
  )
  return chatFlow
}
