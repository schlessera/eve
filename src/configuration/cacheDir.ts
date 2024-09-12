import * as os from 'os'
import * as path from 'path'

export function getCacheDir(): string {
    const eveCacheFolder = process.env.EVE_CACHE_FOLDER
    if (eveCacheFolder) {
        return eveCacheFolder
    }
    return path.join(os.homedir(), '.eve', 'cache')
}