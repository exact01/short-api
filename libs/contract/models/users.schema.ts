import { z } from 'zod';

export const UsersSchema = z.object({
    uuid: z.string().uuid(),
    email: z.string().email(),
    password: z.string(),

    createdAt: z.date(),
    updatedAt: z.date(),
});
