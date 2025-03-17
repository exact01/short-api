export interface IRedisRepository {
    del(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    get(key: string): Promise<null | string>;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
}
