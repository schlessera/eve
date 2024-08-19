import * as z from 'zod';
import { action } from '@genkit-ai/core';
import fs from 'fs';

export const readLocalFile = action(
    {
      name: 'readLocalFile',
      description: 'used for reading the contents of a local file',
      inputSchema: z.object({ subject: z.string() }),
      outputSchema: z.string(),
    },
    async (input) => {
        return fs.readFileSync(input.subject, 'utf8');
    }
  );