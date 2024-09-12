import { Command } from '@oclif/core'
import { CacheFactory, FileCache } from '../../cache'
import * as fs from 'fs/promises'
import * as path from 'path'
import { getCacheDir } from '../../configuration/cacheDir'

interface CacheMetadata {
    url: string;
    timestamp: number;
}

export default class CacheList extends Command {
    static description = 'List all cached items'

    private cache: FileCache

    constructor(argv: string[], config: any) {
        super(argv, config)
        const cacheDir = getCacheDir()
        this.cache = CacheFactory.createCache('file', { cacheDir }) as FileCache
    }

    private async getCacheMetadata(filePath: string): Promise<CacheMetadata | null> {
        try {
            const content = await fs.readFile(filePath, 'utf-8')
            const data = JSON.parse(content)
            return {
                url: data.url,
                timestamp: data.timestamp || 0
            }
        } catch (error) {
            return null
        }
    }

    async run(): Promise<void> {
        const cacheDir = (this.cache as any).cacheDir
        const files = await fs.readdir(cacheDir)

        if (files.length === 0) {
            this.log('Cache is empty')
        } else {
            for (const file of files) {
                const filePath = path.join(cacheDir, file)
                const stats = await fs.stat(filePath)
                const metadata = await this.getCacheMetadata(filePath)

                if (metadata) {
                    const hash = path.parse(file).name
                    const date = new Date(metadata.timestamp || stats.mtime).toISOString()
                    this.log(`scrape:${hash} - ${metadata.url} (cached on ${date})`)
                }
            }
        }
    }
}