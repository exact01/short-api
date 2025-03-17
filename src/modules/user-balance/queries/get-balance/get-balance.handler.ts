import { inject } from 'inversify';

import { IUserBalanceRepository } from '../../repository/interfaces/user-balance.repository.interface';
import { QueryHandler } from '../../../../common/cqrs/decorators/query-handler.decorator';
import { ICommandResponse } from '../../../../common/types/command-response.type';
import { ILogger } from '../../../../common/logger/interfaces/logger.interface';
import { UserBalanceEntity } from '../../entities/user-balance.entity';
import { IQueryHandler } from '../../../../common/cqrs';
import { ERRORS } from '../../../../../libs/contract';
import { GetBalanceQuery } from './get-balance.query';
import { USER_BALANCE_MODULES } from '../../types';
import { TYPES } from '../../../../types';

@QueryHandler(GetBalanceQuery)
export class GetBalanceHandler
    implements IQueryHandler<GetBalanceQuery, ICommandResponse<UserBalanceEntity>>
{
    constructor(
        @inject(USER_BALANCE_MODULES.UserBalanceRepository)
        private userBalanceRepository: IUserBalanceRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {}

    public async execute(query: GetBalanceQuery): Promise<ICommandResponse<UserBalanceEntity>> {
        try {
            const { userUuid } = query;

            const balance = await this.userBalanceRepository.findByUserUuid(userUuid);
            if (!balance) {
                return {
                    isSuccess: false,
                    ...ERRORS.BALANCE_NOT_FOUND,
                };
            }

            return {
                isSuccess: true,
                data: balance,
            };
        } catch (error) {
            this.logger.error('[GetBalanceHandler] Error getting balance:', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
