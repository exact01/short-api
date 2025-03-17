import { ICommandResponse } from '../../../../common/types/command-response.type';
import { LoginCommand, RegisterCommand } from '../../../../../libs/contract';

export interface IAuthService {
    login: (dto: LoginCommand.Request) => Promise<ICommandResponse<LoginCommand.Response['data']>>;
    register: (
        dto: RegisterCommand.Request,
    ) => Promise<ICommandResponse<RegisterCommand.Response['data']>>;
}
