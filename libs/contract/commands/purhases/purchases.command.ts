import { z } from 'zod';

export namespace PurchaseCommand {
    export const RequestSchema = z.object({
        productUuid: z.string().uuid(),
        quantity: z.number(),
    });

    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = z.object({
        data: z.object({
            userBalance: z.number(),
        }),
    });

    export type Response = z.infer<typeof ResponseSchema>;
}
