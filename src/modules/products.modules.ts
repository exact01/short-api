import { userBalanceBindings } from './user-balance/user-balance.modules';
import { purchasesBindings } from './purchases/purchases.module';
import { productsBindings } from './products/products.modules';
import { usersBindings } from './users/users.modules';
import { authBindings } from './auth/auth.modules';
export const productModules = {
    authBindings,
    usersBindings,
    productsBindings,
    userBalanceBindings,
    purchasesBindings,
};
