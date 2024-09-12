import axios, { AxiosError } from 'axios'
import { FileCache, CacheFactory } from '../cache'
import * as crypto from 'crypto'
import { getCacheDir } from '../configuration/cacheDir'

export interface ScraperOptions {
    url: string
    entirePage: boolean
    noCache: boolean
}

export interface ScrapedData {
    html: string
    markdown: string
    text: string
}

export class Scraper {
    private cache: FileCache

    constructor() {
        const cacheDir = getCacheDir()
        this.cache = CacheFactory.createCache('file', { cacheDir }) as FileCache
    }

    private getCacheKey(url: string, entirePage: boolean): string {
        const hash = crypto.createHash('md5').update(`${url}:${entirePage}`).digest('hex')
        return `${hash}.json`
    }

    async scrape(options: ScraperOptions): Promise<ScrapedData> {
        const cacheKey = this.getCacheKey(options.url, options.entirePage)
        let scrapedData: ScrapedData | null = null

        if (!options.noCache) {
            const cachedData = await this.cache.get(cacheKey)
            if (cachedData) {
                const parsed = JSON.parse(cachedData)
                scrapedData = parsed.data
            }
        }

        if (!scrapedData) {
            const apiKey = process.env.FIRECRAWL_API_KEY
            if (!apiKey) {
                throw new Error('FIRECRAWL_API_KEY environment variable is not set')
            }

            try {
                const response = await axios.post('https://api.firecrawl.dev/v1/scrape', {
                    url: options.url,
                    formats: ['html', 'markdown'],
                    onlyMainContent: !options.entirePage
                }, {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (response.data.success) {
                    scrapedData = response.data.data
                    await this.cache.set(cacheKey, JSON.stringify({
                        url: options.url,
                        timestamp: Date.now(),
                        data: scrapedData
                    }))
                } else {
                    throw new Error('Scraping failed')
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    throw new Error(`API request failed: ${error.message}`)
                } else {
                    throw new Error(`An unexpected error occurred: ${error}`)
                }
            }
        }

        if (!scrapedData) {
            throw new Error('Failed to retrieve scraped data')
        }

        return scrapedData
    }
}