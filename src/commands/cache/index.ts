import { Command } from '@oclif/core'

export default class Cache extends Command {
    static description = 'Manage the cache'

    static examples = [
        '$ firecrawl cache list',
        '$ firecrawl cache get <key>',
        '$ firecrawl cache delete <key>',
        '$ firecrawl cache flush',
    ]

    async run(): Promise<void> {
        this.log('Use one of the subcommands: list, get, delete, flush')
        this.log('For more information, run: firecrawl cache --help')
    }
}