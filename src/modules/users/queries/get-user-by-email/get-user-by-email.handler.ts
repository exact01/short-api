import { inject } from 'inversify';

import { IQueryHandler, QueryHandler } from '../../../../common/cqrs';
import { UsersRepository } from '../../repository/users.repository';
import { GetUserByEmailQuery } from './get-user-by-email.query';
import { ILogger } from '../../../../common/logger/interfaces';
import { ICommandResponse } from '../../../../common/types';
import { ERRORS } from '../../../../../libs/contract';
import { UserEntity } from '../../entities';
import { USER_MODULES } from '../../types';
import { TYPES } from '../../../../types';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
    implements IQueryHandler<GetUserByEmailQuery, ICommandResponse<null | UserEntity>>
{
    constructor(
        @inject(USER_MODULES.UsersRepository) private usersRepository: UsersRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {}

    async execute(query: GetUserByEmailQuery): Promise<ICommandResponse<null | UserEntity>> {
        try {
            const user = await this.usersRepository.findByEmail(query.email);

            return {
                isSuccess: true,
                data: user,
            };
        } catch (error) {
            this.logger.error('[GetUserByEmailHandler] Error getting user by email', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
