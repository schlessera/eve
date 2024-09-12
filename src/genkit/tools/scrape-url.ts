import * as z from 'zod'
import { defineTool } from '@genkit-ai/ai'
import { Scraper, ScraperOptions } from '../../utils/scraper'

export function defineScrapeUrlTool() {
    const scrapeUrl = defineTool(
        {
            name: 'scrapeUrl',
            description: 'Scrapes content from a given URL',
            inputSchema: z.object({
                url: z.string().url(),
                entirePage: z.boolean().optional().default(false),
                noCache: z.boolean().optional().default(false),
            }),
            outputSchema: z.object({
                html: z.string(),
                markdown: z.string(),
                text: z.string(),
                error: z.string().optional(),
            }),
        },
        async (input) => {
            const scraper = new Scraper()
            const options: ScraperOptions = {
                url: input.url,
                entirePage: input.entirePage,
                noCache: input.noCache,
            }

            try {
                const scrapedData = await scraper.scrape(options)
                return {
                    ...scrapedData,
                    text: scrapedData.markdown.replace(/\[.*?\]\(.*?\)/g, '').replace(/\n/g, ' '),
                }
            } catch (error) {
                return {
                    html: '',
                    markdown: '',
                    text: '',
                    error: (error as Error).message,
                }
            }
        },
    )
    return scrapeUrl
}