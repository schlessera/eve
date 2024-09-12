import fs from 'fs/promises';
import path from 'path';
import { FileCacheInterface } from './CacheInterface';

export class FileCache implements FileCacheInterface {
    private cacheDir: string;

    constructor(cacheDir: string) {
        this.cacheDir = cacheDir;
    }

    getFilePath(key: string): string {
        return path.join(this.cacheDir, `${key}`);
    }

    async get(key: string): Promise<string | null> {
        try {
            const filePath = this.getFilePath(key);
            const content = await fs.readFile(filePath, 'utf-8');
            return content;
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                return null;
            }
            throw error;
        }
    }

    async set(key: string, value: string): Promise<void> {
        const filePath = this.getFilePath(key);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, value, 'utf-8');
    }

    async delete(key: string): Promise<void> {
        try {
            const filePath = this.getFilePath(key);
            await fs.unlink(filePath);
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
                throw error;
            }
        }
    }

    async clear(): Promise<void> {
        await fs.rm(this.cacheDir, { recursive: true, force: true });
        await fs.mkdir(this.cacheDir, { recursive: true });
    }
}