import { z } from 'zod';

export const PurchasesSchema = z.object({
    uuid: z.string().uuid(),
    productUuid: z.string().uuid(),
    userUuid: z.string().uuid(),
    quantity: z.number(),

    createdAt: z.date(),
    updatedAt: z.date(),
});
