import { z } from 'zod';

export const AuthSchema = z.object({
    jwt: z.string(),
});
