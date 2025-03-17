import { inject } from 'inversify';

import { IRedisRepository } from '../../../../integration-modules/redis/repository/interfaces/redis.repository.interface';
import { CommandHandler } from '../../../../common/cqrs/decorators/command-handler.decorator';
import { ICommandResponse } from '../../../../common/types/command-response.type';
import { INTEGRATION_MODULES } from '../../../../integration-modules/redis/types';
import { ILogger } from '../../../../common/logger/interfaces/logger.interface';
import { CacheProductCommand } from './cache-product.command';
import { ICommandHandler } from '../../../../common/cqrs';
import { ERRORS } from '../../../../../libs/contract';
import { TYPES } from '../../../../types';

@CommandHandler(CacheProductCommand)
export class CacheProductHandler
    implements ICommandHandler<CacheProductCommand, ICommandResponse<void>>
{
    constructor(
        @inject(INTEGRATION_MODULES.RedisRepository)
        private redisRepository: IRedisRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {}

    public async execute(command: CacheProductCommand): Promise<ICommandResponse<void>> {
        try {
            const { product, ttlSeconds } = command;
            const key = `product:${product.uuid}`;

            await this.redisRepository.set(key, JSON.stringify(product), ttlSeconds);

            return {
                isSuccess: true,
            };
        } catch (error) {
            this.logger.error('[CacheProductHandler] Error caching product:', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
