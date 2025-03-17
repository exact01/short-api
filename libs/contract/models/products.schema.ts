import { z } from 'zod';

export const ProductsSchema = z.object({
    uuid: z.string().uuid(),
    marketHashName: z.string(),
    currency: z.string(),
    suggestedPrice: z.number(),
    itemPage: z.string(),
    marketPage: z.string(),
    minPrice: z.number(),
    maxPrice: z.number(),
    meanPrice: z.number(),
    medianPrice: z.number(),
    quantity: z.number(),

    createdAt: z.date(),
    updatedAt: z.date(),
});
