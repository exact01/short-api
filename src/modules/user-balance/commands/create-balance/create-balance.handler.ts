import { inject } from 'inversify';

import { IUserBalanceRepository } from '../../repository/interfaces/user-balance.repository.interface';
import { CommandHandler } from '../../../../common/cqrs/decorators/command-handler.decorator';
import { ICommandResponse } from '../../../../common/types/command-response.type';
import { ILogger } from '../../../../common/logger/interfaces/logger.interface';
import { CreateBalanceCommand } from './create-balance.command';
import { ICommandHandler } from '../../../../common/cqrs';
import { ERRORS } from '../../../../../libs/contract';
import { UserBalanceEntity } from '../../entities';
import { USER_BALANCE_MODULES } from '../../types';
import { TYPES } from '../../../../types';

@CommandHandler(CreateBalanceCommand)
export class CreateBalanceHandler
    implements ICommandHandler<CreateBalanceCommand, ICommandResponse<UserBalanceEntity>>
{
    constructor(
        @inject(USER_BALANCE_MODULES.UserBalanceRepository)
        private userBalanceRepository: IUserBalanceRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {}

    public async execute(
        command: CreateBalanceCommand,
    ): Promise<ICommandResponse<UserBalanceEntity>> {
        try {
            const { userUuid, initialBalance } = command;

            const existingBalance = await this.userBalanceRepository.findByUserUuid(userUuid);
            if (existingBalance) {
                return {
                    isSuccess: false,
                    ...ERRORS.BALANCE_ALREADY_EXISTS,
                };
            }

            const balance = new UserBalanceEntity({
                balance: initialBalance,
                userUuid,
            });
            const created = await this.userBalanceRepository.create(balance);

            return {
                isSuccess: true,
                data: created,
            };
        } catch (error) {
            this.logger.error('[CreateBalanceHandler] Error creating balance:', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
