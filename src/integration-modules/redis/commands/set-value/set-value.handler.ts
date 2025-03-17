import { inject } from 'inversify';

import { CommandHandler } from '../../../../common/cqrs/decorators/command-handler.decorator';
import { IRedisRepository } from '../../repository/interfaces/redis.repository.interface';
import { ICommandResponse } from '../../../../common/types/command-response.type';
import { ILogger } from '../../../../common/logger/interfaces/logger.interface';
import { SetRedisValueCommand } from './set-value.command';
import { ICommandHandler } from '../../../../common/cqrs';
import { ERRORS } from '../../../../../libs/contract';
import { INTEGRATION_MODULES } from '../../types';
import { TYPES } from '../../../../types';

@CommandHandler(SetRedisValueCommand)
export class SetRedisValueHandler
    implements ICommandHandler<SetRedisValueCommand, ICommandResponse<void>>
{
    constructor(
        @inject(INTEGRATION_MODULES.RedisRepository)
        private redisRepository: IRedisRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {}

    public async execute(command: SetRedisValueCommand): Promise<ICommandResponse<void>> {
        try {
            const { key, value, ttlSeconds } = command;

            await this.redisRepository.set(key, value, ttlSeconds);

            return {
                isSuccess: true,
            };
        } catch (error) {
            this.logger.error('[SetRedisValueHandler] Error setting value:', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
