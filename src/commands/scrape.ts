import { Args, Command, Flags } from '@oclif/core'
import { AxiosError } from 'axios'
import { CacheFactory, FileCache } from '../cache'
import * as crypto from 'crypto'
import * as path from 'path'
import { getCacheDir } from '../configuration/cacheDir'

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

    private cache: FileCache

    constructor(argv: string[], config: any) {
        super(argv, config)
        const cacheDir = getCacheDir()
        this.cache = CacheFactory.createCache('file', { cacheDir }) as FileCache
    }

    private getCacheKey(url: string, entirePage: boolean): string {
        const hash = crypto.createHash('md5').update(`${url}:${entirePage}`).digest('hex')
        return `${hash}.json`
    }

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(Scrape)
        const axios = require('axios')

        const apiKey = process.env.FIRECRAWL_API_KEY
        if (!apiKey) {
            this.error('FIRECRAWL_API_KEY environment variable is not set')
        }

        const cacheKey = this.getCacheKey(args.url, flags.entirePage)
        let scrapedData: any

        if (!flags.noCache) {
            const cachedData = await this.cache.get(cacheKey)
            if (cachedData) {
                scrapedData = JSON.parse(cachedData)
                this.log('Using cached data')
            }
        }

        if (!scrapedData) {
            try {
                const response = await axios.post('https://api.firecrawl.dev/v1/scrape', {
                    url: args.url,
                    formats: ['html', 'markdown'],
                    onlyMainContent: !flags.entirePage
                }, {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (response.data.success) {
                    scrapedData = response.data.data
                    // Cache the scraped data with metadata
                    await this.cache.set(cacheKey, JSON.stringify({
                        url: args.url,
                        timestamp: Date.now(),
                        data: scrapedData
                    }))
                } else {
                    this.error('Scraping failed')
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    this.error(`API request failed: ${error.message}`)
                } else {
                    this.error(`An unexpected error occurred: ${error}`)
                }
            }
        }

        if (scrapedData) {
            if (flags.format === 'html') {
                this.log(scrapedData.html)
            } else if (flags.format === 'text') {
                this.log(scrapedData.markdown.replace(/\[.*?\]\(.*?\)/g, '').replace(/\n/g, ' '))
            } else {
                // Default is markdown
                this.log(scrapedData.markdown)
            }
        }
    }
}
