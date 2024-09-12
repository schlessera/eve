import * as os from 'os'
import * as path from 'path'

export function getHistoryDir(): string {
    const eveHistoryPath = process.env.EVE_HISTORY_PATH
    if (eveHistoryPath) {
        return eveHistoryPath
    }
    return path.join(os.homedir(), '.eve', 'history')
}