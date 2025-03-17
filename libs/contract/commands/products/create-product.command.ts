import { z } from 'zod';

import { ProductsSchema } from '../../models';

export namespace CreateProductCommand {
    export const RequestSchema = ProductsSchema.omit({
        uuid: true,
        createdAt: true,
        updatedAt: true,
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
