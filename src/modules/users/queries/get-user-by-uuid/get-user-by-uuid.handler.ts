import { inject } from 'inversify';

import { IQueryHandler, QueryHandler } from '../../../../common/cqrs';
import { UsersRepository } from '../../repository/users.repository';
import { ILogger } from '../../../../common/logger/interfaces';
import { GetUserByUuidQuery } from './get-user-by-uuid.query';
import { ICommandResponse } from '../../../../common/types';
import { ERRORS } from '../../../../../libs/contract';
import { UserEntity } from '../../entities';
import { USER_MODULES } from '../../types';
import { TYPES } from '../../../../types';

@QueryHandler(GetUserByUuidQuery)
export class GetUserByUuidHandler
    implements IQueryHandler<GetUserByUuidQuery, ICommandResponse<null | UserEntity>>
{
    constructor(
        @inject(USER_MODULES.UsersRepository) private usersRepository: UsersRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {}

    async execute(query: GetUserByUuidQuery): Promise<ICommandResponse<null | UserEntity>> {
        try {
            const user = await this.usersRepository.findByUUID(query.uuid);

            return {
                isSuccess: true,
                data: user,
            };
        } catch (error) {
            this.logger.error('[GetUserByUuidHandler] Error getting user by UUID', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
