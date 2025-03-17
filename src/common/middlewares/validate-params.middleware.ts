import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

import { IMiddleware } from './interfaces/middleware.interface';

export class ValidateParamsMiddleware implements IMiddleware {
    constructor(private schema: AnyZodObject) {}

    execute({ params }: Request, res: Response, next: NextFunction): void {
        try {
            this.schema.parse(params);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(422).send(error.errors);
            } else {
                res.status(500).send('Внутренняя ошибка сервера');
            }
        }
    }
}
