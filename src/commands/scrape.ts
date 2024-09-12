import { Args, Command, Flags } from '@oclif/core'
import { Scraper, ScraperOptions } from '../utils/scraper'

export default class Scrape extends Command {
    static args = {
        url: Args.string({ description: 'URL to scrape', required: true }),
    }

    static description: string = 'Scrape content from a given URL'

    static flags = {
        "format": Flags.string({
            char: 'f',
            description: 'Output format (html, markdown, text). Default: markdown',
            options: ['html', 'markdown', 'text'],
            default: 'markdown',
        }),
        "entire-page": Flags.boolean({
            char: 'e',
            description: 'Scrape only the entire page. By default, only the main content is scraped, omitting headers, footers, etc.',
            default: false,
        }),
        "no-cache": Flags.boolean({
            char: 'n',
            description: 'Disable caching and force a new scrape',
            default: false,
        }),
    }

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(Scrape)
        const scraper = new Scraper()

        const options: ScraperOptions = {
            url: args.url,
            entirePage: flags.entirePage,
            noCache: flags.noCache,
        }

        try {
            const scrapedData = await scraper.scrape(options)

            if (flags.format === 'html') {
                this.log(scrapedData.html)
            } else if (flags.format === 'text') {
                this.log(scrapedData.markdown.replace(/\[.*?\]\(.*?\)/g, '').replace(/\n/g, ' '))
            } else {
                // Default is markdown
                this.log(scrapedData.markdown)
            }
        } catch (error) {
            this.error((error as Error).message)
        }
    }
}
