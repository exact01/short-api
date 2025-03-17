import { Container } from 'inversify';

import { DeleteRedisValueHandler } from '../integration-modules/redis/commands/delete-value/delete-value.handler';
import { ExistsRedisValueHandler } from '../integration-modules/redis/queries/exists-value/exists-value.handler';
import { DecrementBalanceHandler } from './user-balance/commands/decrement-balance/decrement-balance.handler';
import { IncrementBalanceHandler } from './user-balance/commands/increment-balance/increment-balance.handler';
import { IncrementQuantityHandler } from './products/commands/increment-quantity/increment-quantity.handler';
import { DecrementQuantityHandler } from './products/commands/decrement-quantity/decrement-quantity.handler';
import { GetProductByUuidHandler } from './products/queries/get-product-by-uuid/get-product-by-uuid.handler';
import { SetRedisValueHandler } from '../integration-modules/redis/commands/set-value/set-value.handler';
import { GetRedisValueHandler } from '../integration-modules/redis/queries/get-value/get-value.handler';
import { CreateBalanceHandler } from './user-balance/commands/create-balance/create-balance.handler';
import { GetUserByEmailHandler } from './users/queries/get-user-by-email/get-user-by-email.handler';
import { GetUserByUuidHandler } from './users/queries/get-user-by-uuid/get-user-by-uuid.handler';
import { CreateProductHandler } from './products/commands/create-product/create-product.handler';
import { CacheProductHandler } from './products/commands/cache-product/cache-product.handler';
import { GetBalanceHandler } from './user-balance/queries/get-balance/get-balance.handler';
import { CreateUserHandler } from './users/commands/create-user/create-user.handler';
import { ICommandBus, IQueryBus } from '../common/cqrs';
import { TYPES } from '../types';

export const initializeCQRSHandlers = (container: Container): void => {
    const commandBus = container.get<ICommandBus>(TYPES.CommandBus);
    const queryBus = container.get<IQueryBus>(TYPES.QueryBus);

    // Users
    commandBus.register(container.get(CreateUserHandler));
    queryBus.register(container.get(GetUserByEmailHandler));
    queryBus.register(container.get(GetUserByUuidHandler));

    // Products
    commandBus.register(container.get(CreateProductHandler));
    commandBus.register(container.get(IncrementQuantityHandler));
    commandBus.register(container.get(DecrementQuantityHandler));
    commandBus.register(container.get(CacheProductHandler));
    queryBus.register(container.get(GetProductByUuidHandler));

    // User Balance
    commandBus.register(container.get(CreateBalanceHandler));
    commandBus.register(container.get(IncrementBalanceHandler));
    commandBus.register(container.get(DecrementBalanceHandler));
    queryBus.register(container.get(GetBalanceHandler));

    // Redis
    commandBus.register(container.get(SetRedisValueHandler));
    commandBus.register(container.get(DeleteRedisValueHandler));
    queryBus.register(container.get(GetRedisValueHandler));
    queryBus.register(container.get(ExistsRedisValueHandler));
};
