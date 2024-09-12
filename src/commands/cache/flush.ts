import { Command } from '@oclif/core'
import { CacheFactory, FileCache } from '../../cache'
import { getCacheDir } from '../../configuration/cacheDir'

export default class CacheFlush extends Command {
    static description = 'Flush the entire cache'

    private cache: FileCache

    constructor(argv: string[], config: any) {
        super(argv, config)
        const cacheDir = getCacheDir()
        this.cache = CacheFactory.createCache('file', { cacheDir }) as FileCache
    }

    async run(): Promise<void> {
        await this.cache.clear()
        this.log('Cache flushed successfully')
    }
}