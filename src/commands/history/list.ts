import { Command } from '@oclif/core'
import * as fs from 'fs/promises'
import { getHistoryDir } from '../../configuration/historyDir'

export default class HistoryList extends Command {
    static description = 'List chat history files'

    async run(): Promise<void> {
        const historyDir = getHistoryDir()
        const files = await fs.readdir(historyDir)

        if (files.length === 0) {
            this.log('No chat history found')
        } else {
            files.forEach(file => {
                this.log(file)
            })
        }
    }
}