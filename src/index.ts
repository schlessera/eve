import { initializeGenKit } from './genkit'
import { defineChatFlow } from './genkit/flows/chat-flow'
import { defineSummarizeFlow } from './genkit/flows/summarize-flow'

export { run } from '@oclif/core'

initializeGenKit(true)

defineChatFlow()
defineSummarizeFlow()