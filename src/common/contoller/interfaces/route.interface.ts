import { NextFunction, Request, Response, Router } from 'express';

import { IMiddleware } from '../../middlewaries/interfaces/middleware.interface';

export type ExpressReturnType = Response<any, Record<string, any>>;

export interface IControllerRoute {
    func: (req: Request, res: Response, next: NextFunction) => void;
    method: keyof Pick<Router, 'delete' | 'get' | 'patch' | 'post' | 'put'>;
    middlewares?: IMiddleware[];
    path: string;
}
