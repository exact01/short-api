import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { ILogger } from '../logger/interfaces/logger.interface';
import { IExeptionFilter } from './interfaces';
import { HTTPError } from './http-error.class';
import { TYPES } from '../../types';

import 'reflect-metadata';

@injectable()
export class ExeptionFilter implements IExeptionFilter {
    constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

    catch(err: Error | HTTPError, req: Request, res: Response, _next: NextFunction): void {
        if (err instanceof HTTPError) {
            this.logger.error(
                `[${err.context}] Error ${err.statusCode} on ${err.route || req.url}: ${err.message}`,
            );
            res.status(err.statusCode).send({
                error: {
                    statusCode: err.statusCode,
                    message: err.message,
                    route: err.route || req.url,
                    timestamp: err.timestamp,
                },
            });
        } else {
            const timestamp = new Date().toISOString();
            this.logger.error(`Error on ${req.url}: ${err.message}`);
            res.status(500).send({
                error: {
                    statusCode: 500,
                    message: err.message,
                    route: req.url,
                    timestamp,
                },
            });
        }
    }
}
