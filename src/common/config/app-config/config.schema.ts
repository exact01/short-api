import { z } from 'zod';

export const configSchema = z.object({
    DATABASE_URL: z.string(),
    APP_PORT: z
        .string()
        .default('3000')
        .transform((port) => parseInt(port, 10)),
    JWT_SECRET: z.string(),
    SALT: z.string(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.string(),
    REDIS_DB: z.string(),
});

export type ConfigSchema = z.infer<typeof configSchema>;
