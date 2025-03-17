import { inject } from 'inversify';

import { QueryHandler } from '../../../../common/cqrs/decorators/query-handler.decorator';
import { IRedisRepository } from '../../repository/interfaces/redis.repository.interface';
import { ICommandResponse } from '../../../../common/types/command-response.type';
import { ILogger } from '../../../../common/logger/interfaces/logger.interface';
import { IQueryHandler } from '../../../../common/cqrs';
import { GetRedisValueQuery } from './get-value.query';
import { ERRORS } from '../../../../../libs/contract';
import { INTEGRATION_MODULES } from '../../types';
import { TYPES } from '../../../../types';

@QueryHandler(GetRedisValueQuery)
export class GetRedisValueHandler
    implements IQueryHandler<GetRedisValueQuery, ICommandResponse<null | string>>
{
    constructor(
        @inject(INTEGRATION_MODULES.RedisRepository)
        private redisRepository: IRedisRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {}

    public async execute(query: GetRedisValueQuery): Promise<ICommandResponse<null | string>> {
        try {
            const { key } = query;

            const value = await this.redisRepository.get(key);

            return {
                isSuccess: true,
                data: value,
            };
        } catch (error) {
            this.logger.error('[GetRedisValueHandler] Error getting value:', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
