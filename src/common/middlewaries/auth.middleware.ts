import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { IMiddleware } from './interfaces';

export class AuthMiddleware implements IMiddleware {
    constructor(private secret: string) {}

    execute(req: Request, res: Response, next: NextFunction): void {
        if (req.headers.authorization) {
            verify(req.headers.authorization.split(' ')[1], this.secret, (err, payload) => {
                if (err) {
                    next();
                } else if (payload) {
                    req.user = payload as { email: string; uuid: string };
                    next();
                }
            });
        } else {
            next();
        }
    }
}
