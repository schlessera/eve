import { initializeGenKit } from './genkit'
import { defineChatFlow } from './genkit/flows/chat-flow'
import { defineSummarizeFlow } from './genkit/flows/summarize-flow'
import { defineIsLocalFilepathTool } from './genkit/tools/is-local-filepath'
import { defineReadLocalFileTool } from './genkit/tools/read-local-file'

export { run } from '@oclif/core'

initializeGenKit(true)

defineChatFlow()
defineSummarizeFlow()
defineIsLocalFilepathTool()
defineReadLocalFileTool()
