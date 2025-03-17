import { ContainerModule } from 'inversify';
import { User } from '@prisma/client';

import { GetUserByEmailHandler } from './queries/get-user-by-email/get-user-by-email.handler';
import { GetUserByUuidHandler } from './queries/get-user-by-uuid/get-user-by-uuid.handler';
import { CreateUserHandler } from './commands/create-user/create-user.handler';
import { IUserService } from './service/interfaces/users.service.interface';
import { UsersRepository } from './repository/users.repository';
import { UserController } from './controller/users.controller';
import { UniversalConverter } from '../../common/converter';
import { IUsersRepository } from './repository/interfaces';
import { IUserController } from './controller/interfaces';
import { UserService } from './service/users.service';
import { UserConverter } from './users.converter';
import { UserEntity } from './entities';
import { USER_MODULES } from './types';

export { USER_MODULES };

export const usersBindings = new ContainerModule((bind) => {
    bind<IUserController>(USER_MODULES.UserController).to(UserController).inSingletonScope();
    bind<IUserService>(USER_MODULES.UserService).to(UserService).inSingletonScope();
    bind<IUsersRepository>(USER_MODULES.UsersRepository).to(UsersRepository).inSingletonScope();
    bind<UniversalConverter<UserEntity, User>>(USER_MODULES.UserConverter)
        .to(UserConverter)
        .inSingletonScope();

    // Регистрация CQRS хендлеров
    bind(CreateUserHandler).toSelf().inSingletonScope();
    bind(GetUserByEmailHandler).toSelf().inSingletonScope();
    bind(GetUserByUuidHandler).toSelf().inSingletonScope();
});
