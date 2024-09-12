import { Args, Command } from '@oclif/core'
import { CacheFactory, FileCache } from '../../cache'
import { getCacheDir } from '../../configuration/cacheDir'

export default class CacheDelete extends Command {
    static description = 'Delete a cached item by key'

    static args = {
        key: Args.string({ description: 'Cache key', required: true }),
    }

    private cache: FileCache

    constructor(argv: string[], config: any) {
        super(argv, config)
        const cacheDir = getCacheDir()
        this.cache = CacheFactory.createCache('file', { cacheDir }) as FileCache
    }

    async run(): Promise<void> {
        const { args } = await this.parse(CacheDelete)
        await this.cache.delete(args.key)
        this.log(`Deleted cache item with key: ${args.key}`)
    }
}