import { NextFunction, Request, Response } from 'express';

export interface IProductController {
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getByUUID: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
