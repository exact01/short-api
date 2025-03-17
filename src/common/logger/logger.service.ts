import { injectable } from 'inversify';
import { Logger } from 'tslog';

import { ILogger } from './interfaces';

import 'reflect-metadata';

@injectable()
export class LoggerService implements ILogger {
    public logger: Logger<unknown>;

    constructor() {
        this.logger = new Logger({
            name: '',
            hideLogPositionForProduction: true,
        });
    }

    log(...args: unknown[]): void {
        this.logger.info(...args);
    }

    error(...args: unknown[]): void {
        // отправка в sentry / rollbar
        this.logger.error(...args);
    }

    warn(...args: unknown[]): void {
        this.logger.warn(...args);
    }
}
