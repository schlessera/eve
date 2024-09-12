import { Command } from '@oclif/core'
import { CacheFactory, FileCache } from '../../cache'
import * as fs from 'fs/promises'
import { getCacheDir } from '../../configuration/cacheDir'

export default class CacheList extends Command {
    static description = 'List all cached items'

    private cache: FileCache

    constructor(argv: string[], config: any) {
        super(argv, config)
        const cacheDir = getCacheDir()
        this.cache = CacheFactory.createCache('file', { cacheDir }) as FileCache
    }

    async run(): Promise<void> {
        const cacheDir = (this.cache as any).cacheDir
        const files = await fs.readdir(cacheDir)

        if (files.length === 0) {
            this.log('Cache is empty')
        } else {
            files.forEach(file => {
                this.log(file)
            })
        }
    }
}