import { z } from 'zod';

export namespace LoginCommand {
    export const ResponseSchema = z.object({
        data: z.object({
            jwt: z.string(),
        }),
    });

    export type Response = z.infer<typeof ResponseSchema>;

    export const RequestSchema = z.object({
        email: z.string().email(),
        password: z.string(),
    });

    export type Request = z.infer<typeof RequestSchema>;
}
