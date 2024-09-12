import { CacheInterface } from './CacheInterface';
import { FileCache } from './FileCache';
import { KeyValueCache } from './KeyValueCache';

export class CacheFactory {
    static createCache(type: 'file' | 'keyvalue', options: { cacheDir: string, fileName?: string }): CacheInterface {
        switch (type) {
            case 'file':
                return new FileCache(options.cacheDir);
            case 'keyvalue':
                return new KeyValueCache(options.cacheDir, options.fileName);
            default:
                throw new Error(`Unsupported cache type: ${type}`);
        }
    }
}