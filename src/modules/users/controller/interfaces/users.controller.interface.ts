import { NextFunction, Request, Response } from 'express';

export interface IUserController {
    info: (req: Request, res: Response, next: NextFunction) => void;
}
