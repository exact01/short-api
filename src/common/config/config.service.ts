import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';

import { ConfigSchema, configSchema } from './app-config/config.schema';
import { ILogger } from '../logger/interfaces/logger.interface';
import { IConfigService } from './interfaces';
import { TYPES } from '../../types';

@injectable()
export class ConfigService implements IConfigService {
    private config!: ConfigSchema;

    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        const result: DotenvConfigOutput = config();
        if (result.error) {
            this.logger.error('[ConfigService] Failed to read .env file or it is missing');
            throw result.error;
        }

        this.logger.log('[ConfigService] .env file is loaded');
        const parsed = result.parsed as DotenvParseOutput;

        try {
            this.config = configSchema.parse(parsed);
            this.logger.log('[ConfigService] Environment variables validated successfully');
        } catch (error) {
            this.logger.error('[ConfigService] Environment validation failed');
            throw error;
        }
    }

    public get(key: string): string;
    public get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T];
    public get(key: keyof ConfigSchema | string): ConfigSchema[keyof ConfigSchema] | string {
        return this.config[key as keyof ConfigSchema];
    }

    public getOrThrow(key: string): string;
    public getOrThrow<T extends keyof ConfigSchema>(key: T): ConfigSchema[T];
    public getOrThrow(key: keyof ConfigSchema | string): ConfigSchema[keyof ConfigSchema] | string {
        const value = this.get(key);
        if (value === undefined) {
            throw new Error(`[ConfigService] key ${key} is not defined`);
        }
        return value;
    }
}
