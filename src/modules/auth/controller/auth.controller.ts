import { ParamsDictionary } from 'express-serve-static-core';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { ValidateBodyMiddleware } from '../../../common/middlewaries/validate-body.middleware';
import { LoginCommand, RegisterCommand } from '../../../../libs/contract/commands/auth';

import 'reflect-metadata';

import { ILogger } from '../../../common/logger/interfaces/logger.interface';
import { errorHandler } from '../../../common/helpers/error-handler.helper';
import { BaseController } from '../../../common/contoller/base.controller';
import { AuthResponseModel } from '../models/auth-response.model';
import { REST_API } from '../../../../libs/contract/api/routes';
import { IAuthService } from '../service/interfaces';
import { IAuthController } from './interfaces';
import { AUTH_MODULES } from '../types';
import { TYPES } from '../../../types';

@injectable()
export class AuthController extends BaseController implements IAuthController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(AUTH_MODULES.AuthService) private authService: IAuthService,
    ) {
        super(loggerService);
        this.loggerService.log('[AuthController] Routes initialized successfully');
        this.bindRoutes([
            {
                path: REST_API.AUTH.REGISTER,
                method: 'post',
                func: this.register,
                middlewares: [new ValidateBodyMiddleware(RegisterCommand.RequestSchema)],
            },
            {
                path: REST_API.AUTH.LOGIN,
                method: 'post',
                func: this.login,
                middlewares: [new ValidateBodyMiddleware(LoginCommand.RequestSchema)],
            },
        ]);
    }

    public async login(
        req: Request<ParamsDictionary, unknown, LoginCommand.Request>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { body } = req;
            const answer = await this.authService.login(body);
            const result = errorHandler(answer, 'AuthController.login', REST_API.AUTH.LOGIN);
            const response: LoginCommand.Response = {
                data: new AuthResponseModel(result),
            };

            this.ok(res, response);
        } catch (error) {
            next(error);
        }
    }

    public async register(
        req: Request<ParamsDictionary, unknown, RegisterCommand.Request>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { body } = req;
            const answer = await this.authService.register(body);
            const result = errorHandler(answer, 'AuthController.register', REST_API.AUTH.REGISTER);
            const response: RegisterCommand.Response = {
                data: new AuthResponseModel(result),
            };

            this.ok(res, response);
        } catch (error) {
            next(error);
        }
    }
}
