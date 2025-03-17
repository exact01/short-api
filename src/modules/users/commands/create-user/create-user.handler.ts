import { inject } from 'inversify';

import { CommandHandler, ICommandHandler } from '../../../../common/cqrs';
import { UsersRepository } from '../../repository/users.repository';
import { ILogger } from '../../../../common/logger/interfaces';
import { ICommandResponse } from '../../../../common/types';
import { CreateUserCommand } from './create-user.command';
import { ERRORS } from '../../../../../libs/contract';
import { UserEntity } from '../../entities';
import { USER_MODULES } from '../../types';
import { TYPES } from '../../../../types';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler
    implements ICommandHandler<CreateUserCommand, ICommandResponse<UserEntity>>
{
    constructor(
        @inject(USER_MODULES.UsersRepository) private usersRepository: UsersRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {}

    async execute(command: CreateUserCommand): Promise<ICommandResponse<UserEntity>> {
        try {
            const userEntity = new UserEntity({
                email: command.email,
                password: command.password,
            });

            const user = await this.usersRepository.create(userEntity);

            return {
                isSuccess: true,
                data: user,
            };
        } catch (error) {
            this.logger.error('[CreateUserHandler] Error creating user', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
