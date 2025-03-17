import { inject, injectable } from 'inversify';

import { ICommandResponse } from '../../../common/types/command-response.type';
import { IUsersRepository } from '../repository/interfaces';
import { ERRORS } from '../../../../libs/contract';
import { IUserService } from './interfaces';
import { UserEntity } from '../entities';
import { USER_MODULES } from '../types';

@injectable()
export class UserService implements IUserService {
    constructor(@inject(USER_MODULES.UsersRepository) private usersRepository: IUsersRepository) {}

    public async getUserInfo(uuid: string): Promise<ICommandResponse<UserEntity>> {
        try {
            const user = await this.usersRepository.findByUUID(uuid);
            if (!user) {
                return {
                    isSuccess: false,
                    ...ERRORS.USER_NOT_FOUND,
                };
            }

            return {
                isSuccess: true,
                data: user,
            };
        } catch (error) {
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
