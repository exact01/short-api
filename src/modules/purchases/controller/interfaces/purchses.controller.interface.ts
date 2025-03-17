import { NextFunction, Request, Response } from 'express';

export interface IPurchasesController {
    purchase: (req: Request, res: Response, next: NextFunction) => void;
}
