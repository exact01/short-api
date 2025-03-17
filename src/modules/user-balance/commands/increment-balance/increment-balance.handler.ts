import { inject } from 'inversify';

import { IUserBalanceRepository } from '../../repository/interfaces/user-balance.repository.interface';
import { CommandHandler } from '../../../../common/cqrs/decorators/command-handler.decorator';
import { ICommandResponse } from '../../../../common/types/command-response.type';
import { ILogger } from '../../../../common/logger/interfaces/logger.interface';
import { UserBalanceEntity } from '../../entities/user-balance.entity';
import { IncrementBalanceCommand } from './increment-balance.command';
import { ICommandHandler } from '../../../../common/cqrs';
import { ERRORS } from '../../../../../libs/contract';
import { USER_BALANCE_MODULES } from '../../types';
import { TYPES } from '../../../../types';

@CommandHandler(IncrementBalanceCommand)
export class IncrementBalanceHandler
    implements ICommandHandler<IncrementBalanceCommand, ICommandResponse<UserBalanceEntity>>
{
    constructor(
        @inject(USER_BALANCE_MODULES.UserBalanceRepository)
        private userBalanceRepository: IUserBalanceRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {}

    public async execute(
        command: IncrementBalanceCommand,
    ): Promise<ICommandResponse<UserBalanceEntity>> {
        try {
            const { userUuid, amount } = command;

            const balance = await this.userBalanceRepository.findByUserUuid(userUuid);
            if (!balance) {
                return {
                    isSuccess: false,
                    ...ERRORS.BALANCE_NOT_FOUND,
                };
            }

            const updated = await this.userBalanceRepository.incrementBalance(userUuid, amount);

            return {
                isSuccess: true,
                data: updated,
            };
        } catch (error) {
            this.logger.error('[IncrementBalanceHandler] Error incrementing balance:', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
