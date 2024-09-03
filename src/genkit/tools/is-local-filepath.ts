import * as z from 'zod'
import fs from 'fs'
import {defineTool} from '@genkit-ai/ai'

// The entire tool definition needs to be contained within a function,
// in order to not immediately trigger it during OCLIF's command loading.
export function defineIsLocalFilepathTool() {
  // Define a tool that reads checks if a given string is a local filepath.
  const readLocalFile = defineTool(
    {
      name: 'isLocalFilepath',
      description: 'Checks if the given text is a local file path.',
      inputSchema: z.object({filepath: z.string()}),
      outputSchema: z.object({filepath: z.string(), isValidFilePath: z.boolean(), error: z.string()}),
    },
    async (input) => {
      let filepath = input.filepath
      let isValidFilePath = true
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
          isValidFilePath = false
        }
      } catch (e) {
        // If the file is not found, we will provide the original path.
        error = `Could not find the file: ${filepath}`
        isValidFilePath = false
      }

      return {
        filepath: filepath,
        isValidFilePath: isValidFilePath,
        error: error,
      }
    },
  )
  return readLocalFile
}
