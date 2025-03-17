import { inject } from 'inversify';

import { QueryHandler } from '../../../../common/cqrs/decorators/query-handler.decorator';
import { ICommandResponse } from '../../../../common/types/command-response.type';
import { ILogger } from '../../../../common/logger/interfaces/logger.interface';
import { IRedisRepository } from '../../repository/interfaces';
import { ExistsRedisValueQuery } from './exists-value.query';
import { IQueryHandler } from '../../../../common/cqrs';
import { ERRORS } from '../../../../../libs/contract';
import { INTEGRATION_MODULES } from '../../types';
import { TYPES } from '../../../../types';

@QueryHandler(ExistsRedisValueQuery)
export class ExistsRedisValueHandler
    implements IQueryHandler<ExistsRedisValueQuery, ICommandResponse<boolean>>
{
    constructor(
        @inject(INTEGRATION_MODULES.RedisRepository)
        private redisRepository: IRedisRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {}

    public async execute(query: ExistsRedisValueQuery): Promise<ICommandResponse<boolean>> {
        try {
            const { key } = query;

            const exists = await this.redisRepository.exists(key);

            return {
                isSuccess: true,
                data: exists,
            };
        } catch (error) {
            this.logger.error('[ExistsRedisValueHandler] Error checking value existence:', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
