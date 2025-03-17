import { inject, injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';

import { ILogger } from '../logger/interfaces/logger.interface';
import { TYPES } from '../../types';

@injectable()
export class PrismaService {
    client: PrismaClient;

    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        this.client = new PrismaClient();
    }

    async connect(): Promise<void> {
        try {
            await this.client.$connect();
            this.logger.log('[PrismaService] Successfully connected to the database');
        } catch (e) {
            if (e instanceof Error) {
                this.logger.error('[PrismaService] Error connecting to the database: ' + e.message);
            }
        }
    }

    async disconnect(): Promise<void> {
        await this.client.$disconnect();
    }
}
