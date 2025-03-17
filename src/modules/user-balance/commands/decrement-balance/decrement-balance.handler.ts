import { inject } from 'inversify';

import { IUserBalanceRepository } from '../../repository/interfaces/user-balance.repository.interface';
import { CommandHandler } from '../../../../common/cqrs/decorators/command-handler.decorator';
import { ICommandResponse } from '../../../../common/types/command-response.type';
import { ILogger } from '../../../../common/logger/interfaces/logger.interface';
import { UserBalanceEntity } from '../../entities/user-balance.entity';
import { DecrementBalanceCommand } from './decrement-balance.command';
import { ICommandHandler } from '../../../../common/cqrs';
import { ERRORS } from '../../../../../libs/contract';
import { USER_BALANCE_MODULES } from '../../types';
import { TYPES } from '../../../../types';

@CommandHandler(DecrementBalanceCommand)
export class DecrementBalanceHandler
    implements ICommandHandler<DecrementBalanceCommand, ICommandResponse<UserBalanceEntity>>
{
    constructor(
        @inject(USER_BALANCE_MODULES.UserBalanceRepository)
        private userBalanceRepository: IUserBalanceRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {}

    public async execute(
        command: DecrementBalanceCommand,
    ): Promise<ICommandResponse<UserBalanceEntity>> {
        try {
            const { userUuid, amount } = command;

            const balance = await this.userBalanceRepository.findByUserUuid(userUuid);
            if (!balance || balance.balance < amount) {
                return {
                    isSuccess: false,
                    ...ERRORS.BALANCE_NOT_FOUND,
                };
            }

            const updated = await this.userBalanceRepository.decrementBalance(userUuid, amount);

            return {
                isSuccess: true,
                data: updated,
            };
        } catch (error) {
            this.logger.error('[DecrementBalanceHandler] Error decrementing balance:', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
