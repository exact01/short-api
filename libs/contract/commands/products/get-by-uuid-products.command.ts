import { z } from 'zod';

import { ProductsSchema } from '../../models';

export namespace GetByUUIDProductsCommand {
    export const RequestSchema = z.object({
        uuid: z.string().uuid(),
    });

    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = z.object({
        data: z.object({
            product: ProductsSchema.pick({
                uuid: true,
                marketHashName: true,
                currency: true,
                minPrice: true,
                meanPrice: true,
            }),
        }),
    });

    export type Response = z.infer<typeof ResponseSchema>;
}
