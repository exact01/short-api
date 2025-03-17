import { z } from 'zod';

export const UserBalanceSchema = z.object({
    uuid: z.string().uuid(),
    balance: z.number(),
    userUuid: z.string().uuid(),

    createdAt: z.date(),
    updatedAt: z.date(),
});
