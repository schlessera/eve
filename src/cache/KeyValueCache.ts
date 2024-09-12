import fs from 'fs/promises';
import path from 'path';
import { KeyValueCacheInterface } from './CacheInterface';

export class KeyValueCache implements KeyValueCacheInterface {
    private cacheFile: string;
    private cache: Record<string, string> = {};

    constructor(cacheDir: string, fileName: string = 'keyvalue_cache.json') {
        this.cacheFile = path.join(cacheDir, fileName);
    }

    async load(): Promise<void> {
        try {
            const content = await fs.readFile(this.cacheFile, 'utf-8');
            this.cache = JSON.parse(content);
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
                throw error;
            }
        }
    }

    async save(): Promise<void> {
        await fs.mkdir(path.dirname(this.cacheFile), { recursive: true });
        await fs.writeFile(this.cacheFile, JSON.stringify(this.cache), 'utf-8');
    }

    async get(key: string): Promise<string | null> {
        return this.cache[key] || null;
    }

    async set(key: string, value: string): Promise<void> {
        this.cache[key] = value;
        await this.save();
    }

    async delete(key: string): Promise<void> {
        delete this.cache[key];
        await this.save();
    }

    async clear(): Promise<void> {
        this.cache = {};
        await this.save();
    }
}