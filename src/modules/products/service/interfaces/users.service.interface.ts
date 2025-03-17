import { ICommandResponse } from '../../../../common/types/command-response.type';
import { UserEntity } from '../../entities';

export interface IUserService {
    getUserInfo: (uuid: string) => Promise<ICommandResponse<UserEntity>>;
}
