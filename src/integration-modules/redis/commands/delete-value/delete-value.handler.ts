import { inject } from 'inversify';

import { CommandHandler } from '../../../../common/cqrs/decorators/command-handler.decorator';
import { IRedisRepository } from '../../repository/interfaces/redis.repository.interface';
import { ICommandResponse } from '../../../../common/types/command-response.type';
import { ILogger } from '../../../../common/logger/interfaces/logger.interface';
import { DeleteRedisValueCommand } from './delete-value.command';
import { ICommandHandler } from '../../../../common/cqrs';
import { ERRORS } from '../../../../../libs/contract';
import { INTEGRATION_MODULES } from '../../types';
import { TYPES } from '../../../../types';

@CommandHandler(DeleteRedisValueCommand)
export class DeleteRedisValueHandler
    implements ICommandHandler<DeleteRedisValueCommand, ICommandResponse<void>>
{
    constructor(
        @inject(INTEGRATION_MODULES.RedisRepository)
        private redisRepository: IRedisRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {}

    public async execute(command: DeleteRedisValueCommand): Promise<ICommandResponse<void>> {
        try {
            const { key } = command;

            await this.redisRepository.del(key);

            return {
                isSuccess: true,
            };
        } catch (error) {
            this.logger.error('[DeleteRedisValueHandler] Error deleting value:', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
