import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

import { IRedisRepository } from './interfaces/redis.repository.interface';
import { INTEGRATION_MODULES } from '../types';

@injectable()
export class RedisRepository implements IRedisRepository {
    constructor(
        @inject(INTEGRATION_MODULES.RedisClient)
        private readonly redisClient: Redis,
    ) {}

    public async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        if (ttlSeconds) {
            await this.redisClient.setex(key, ttlSeconds, value);
        } else {
            await this.redisClient.set(key, value);
        }
    }

    public async get(key: string): Promise<null | string> {
        return this.redisClient.get(key);
    }

    public async del(key: string): Promise<void> {
        await this.redisClient.del(key);
    }

    public async exists(key: string): Promise<boolean> {
        const result = await this.redisClient.exists(key);
        return result === 1;
    }
}
