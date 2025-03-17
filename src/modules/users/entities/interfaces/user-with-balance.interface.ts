import { Prisma } from '@prisma/client';

export interface IUsersWithBalance
    extends Prisma.UserGetPayload<{
        include: {
            userBalance: true;
        };
    }> {}
