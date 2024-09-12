import { Args, Command } from '@oclif/core'
import { CacheFactory, FileCache } from '../../cache'
import { getCacheDir } from '../../configuration/cacheDir'

export default class CacheGet extends Command {
    static description = 'Get a cached item by key'

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
        const { args } = await this.parse(CacheGet)
        const value = await this.cache.get(args.key)

        if (value === null) {
            this.log(`No cached item found for key: ${args.key}`)
        } else {
            this.log(value)
        }
    }
}