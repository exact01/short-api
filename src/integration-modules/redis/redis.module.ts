import { ContainerModule } from 'inversify';
import { Redis } from 'ioredis';

import { DeleteRedisValueHandler } from './commands/delete-value/delete-value.handler';
import { ExistsRedisValueHandler } from './queries/exists-value/exists-value.handler';
import { IRedisRepository } from './repository/interfaces/redis.repository.interface';
import { SetRedisValueHandler } from './commands/set-value/set-value.handler';
import { GetRedisValueHandler } from './queries/get-value/get-value.handler';
import { RedisRepository } from './repository';
import { INTEGRATION_MODULES } from './types';

export const redisBindings = new ContainerModule((bind) => {
    // Redis
    const redisClient = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),

        db: parseInt(process.env.REDIS_DB || '0'),
    });

    // Redis Repository
    bind<Redis>(INTEGRATION_MODULES.RedisClient).toConstantValue(redisClient);
    bind<IRedisRepository>(INTEGRATION_MODULES.RedisRepository)
        .to(RedisRepository)
        .inSingletonScope();

    // Redis Handlers
    bind(SetRedisValueHandler).toSelf().inSingletonScope();
    bind(GetRedisValueHandler).toSelf().inSingletonScope();
    bind(DeleteRedisValueHandler).toSelf().inSingletonScope();
    bind(ExistsRedisValueHandler).toSelf().inSingletonScope();
});
