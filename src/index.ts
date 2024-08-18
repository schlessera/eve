import { ConfigOptions, configureGenkit } from '@genkit-ai/core';
import { startFlowsServer } from '@genkit-ai/flow';
import { googleAI } from '@genkit-ai/googleai';

import { menuSuggestionFlow } from './flows/menu-suggestion-flow';

configureGenkit({
  // Perform OpenTelemetry instrumentation and enable trace collection.
  enableTracingAndMetrics: true,
  flows: [menuSuggestionFlow],
  // Log debug output to tbe console.
  logLevel: 'debug',
  plugins: [
    // Load the Google AI plugin. You can optionally specify your API key
    // by passing in a config object; if you don't, the Google AI plugin uses
    // the value from the GOOGLE_GENAI_API_KEY environment variable, which is
    // the recommended practice.
    googleAI(),
  ],
} as ConfigOptions);

// Start a flow server, which exposes your flows as HTTP endpoints. This call
// must come last, after all of your plug-in configuration and flow definitions.
// You can optionally specify a subset of flows to serve, and configure some
// HTTP server options, but by default, the flow server serves all defined flows.
startFlowsServer();

export {run} from '@oclif/core'
