import { Args, Command } from '@oclif/core'
import { CacheFactory, FileCache } from '../../cache'
import { getCacheDir } from '../../configuration/cacheDir'
import * as fs from 'fs/promises'
import * as path from 'path'

export default class CacheDelete extends Command {
    static description = 'Delete a cached item by hash'

    static args = {
        hash: Args.string({ description: 'Full or partial hash of the cache item', required: true }),
    }

    private cache: FileCache

    constructor(argv: string[], config: any) {
        super(argv, config)
        const cacheDir = getCacheDir()
        this.cache = CacheFactory.createCache('file', { cacheDir }) as FileCache
    }

    private async findMatchingFile(partialHash: string): Promise<string | null> {
        const cacheDir = (this.cache as any).cacheDir
        const files = await fs.readdir(cacheDir)
        const matchingFiles = files.filter(file => file.startsWith(partialHash) && file.endsWith('.json'))

        if (matchingFiles.length === 0) {
            return null
        } else if (matchingFiles.length === 1) {
            return matchingFiles[0]
        } else {
            throw new Error(`Multiple matches found for hash '${partialHash}': ${matchingFiles.join(', ')}`)
        }
    }

    async run(): Promise<void> {
        const { args } = await this.parse(CacheDelete)
        const matchingFile = await this.findMatchingFile(args.hash)

        if (matchingFile === null) {
            this.error(`No cached item found for hash: ${args.hash}`)
        } else {
            await this.cache.delete(matchingFile)
            this.log(`Deleted cache item: ${matchingFile}`)
        }
    }
}