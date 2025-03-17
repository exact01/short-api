import { z } from 'zod';

import { ProductsSchema } from '../../models';

export namespace GetAllProductsCommand {
    export const ResponseSchema = z.object({
        data: z.object({
            products: z.array(
                ProductsSchema.pick({
                    uuid: true,
                    marketHashName: true,
                    minPrice: true,
                    meanPrice: true,
                    suggestedPrice: true,
                    quantity: true,
                }),
            ),
        }),
    });
    export type Response = z.infer<typeof ResponseSchema>;
}
