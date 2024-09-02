import * as z from 'zod'
import fs from 'fs'
import {defineTool} from '@genkit-ai/ai'

// The entire tool definition needs to be contained within a function,
// in order to not immediately trigger it during OCLIF's command loading.
export function defineReadLocalFileTool() {
  // Define a tool that reads the contents of a local file.
  const readLocalFile = defineTool(
    {
      name: 'readLocalFile',
      description: 'used for reading the contents of a local file that was passed as the filepath string',
      inputSchema: z.object({filepath: z.string()}),
      outputSchema: z.object({filepath: z.string(), content: z.string(), error: z.string()}),
    },
    async (input) => {
      let filepath = input.filepath
      let content = ''
      let error = ''
      try {
        // Check if the file exists.
        fs.accessSync(filepath, fs.constants.F_OK)
        try {
          // We want to provide an absolute filepath to the model for additional context.
          filepath = fs.realpathSync(filepath)
        } catch (e) {
          // If the file is not found, we will provide the original path.
          error = `Could not resolve the real path of the file: ${filepath}`
        }
      } catch (e) {
        // If the file is not found, we will provide the original path.
        error = `Could not find the file: ${filepath}`
      }

      try {
        content = fs.readFileSync(filepath, 'utf8')
      } catch (e) {
        error = `Could not read the file: ${filepath}`
      }
      return {
        filepath: filepath,
        content: content,
        error: error,
      }
    },
  )
  return readLocalFile
}
