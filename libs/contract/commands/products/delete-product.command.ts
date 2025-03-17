import { z } from 'zod';

export namespace DeleteProductCommand {
    export const RequestSchema = z.object({
        uuid: z.string().uuid(),
    });

    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = z.object({
        data: z.object({
            isSuccess: z.boolean(),
        }),
    });

    export type Response = z.infer<typeof ResponseSchema>;
}
