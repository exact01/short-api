import { z } from 'zod';

import { UsersSchema } from '../../models';

export namespace GetUserCommand {
    export const ResponseSchema = z.object({
        data: z.object({
            user: UsersSchema.pick({
                uuid: true,
                email: true,
            }).extend({
                balance: z.number(),
            }),
        }),
    });

    export type Response = z.infer<typeof ResponseSchema>;
}
