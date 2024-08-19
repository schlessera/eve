import { ConfigOptions, configureGenkit } from '@genkit-ai/core';
import { PluginOptions, googleAI } from '@genkit-ai/googleai';

export async function initializeGenKit(debug: boolean): Promise<void> {
    const config: ConfigOptions = {
        // Perform OpenTelemetry instrumentation and enable trace collection.
        enableTracingAndMetrics: true,
        // Log debug output to the console.
        logLevel: debug === true ? 'debug' : 'error',
        plugins: [
            // Load the Google AI plugin. You can optionally specify your API key
            // by passing in a config object; if you don't, the Google AI plugin uses
            // the value from the GOOGLE_GENAI_API_KEY environment variable, which is
            // the recommended practice.
            googleAI({
                apiKey: process.env.GOOGLE_GENAI_API_KEY,
            } as PluginOptions),
        ],
    };

    configureGenkit(config);
}