import { UserBalance } from '@prisma/client';
import { ContainerModule } from 'inversify';

import { IUserBalanceRepository } from './repository/interfaces/user-balance.repository.interface';
import { DecrementBalanceHandler } from './commands/decrement-balance/decrement-balance.handler';
import { IncrementBalanceHandler } from './commands/increment-balance/increment-balance.handler';
import { CreateBalanceHandler } from './commands/create-balance/create-balance.handler';
import { GetBalanceHandler } from './queries/get-balance/get-balance.handler';
import { UserBalanceRepository } from './repository/user-balance.repository';
import { UserBalanceEntity } from './entities/user-balance.entity';
import { UserBalanceConverter } from './user-balance.converter';
import { UniversalConverter } from '../../common/converter';
import { USER_BALANCE_MODULES } from './types';

export const userBalanceBindings = new ContainerModule((bind) => {
    bind<IUserBalanceRepository>(USER_BALANCE_MODULES.UserBalanceRepository)
        .to(UserBalanceRepository)
        .inSingletonScope();
    bind<UniversalConverter<UserBalanceEntity, UserBalance>>(
        USER_BALANCE_MODULES.UserBalanceConverter,
    )
        .to(UserBalanceConverter)
        .inSingletonScope();

    // Register CQRS handlers
    bind(CreateBalanceHandler).toSelf().inSingletonScope();
    bind(IncrementBalanceHandler).toSelf().inSingletonScope();
    bind(DecrementBalanceHandler).toSelf().inSingletonScope();
    bind(GetBalanceHandler).toSelf().inSingletonScope();
});
