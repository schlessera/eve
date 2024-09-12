export interface CacheInterface {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
}

export interface FileCacheInterface extends CacheInterface {
    getFilePath(key: string): string;
}

export interface KeyValueCacheInterface extends CacheInterface {
    load(): Promise<void>;
    save(): Promise<void>;
}