import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { ILogger } from '../../../common/logger/interfaces/logger.interface';
import { IUserService } from '../service/interfaces/users.service.interface';
import { errorHandler } from '../../../common/helpers/error-handler.helper';

import 'reflect-metadata';

import { BaseController } from '../../../common/contoller/base.controller';
import { IUserController } from './interfaces/users.controller.interface';
import { GetUserCommand, REST_API } from '../../../../libs/contract';
import { UserResponseModel } from '../model/users-response.model';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { USER_MODULES } from '../types';
import { TYPES } from '../../../types';

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(USER_MODULES.UserService) private userService: IUserService,
    ) {
        super(loggerService);
        this.loggerService.log('[UserController] Routes initialized successfully');
        this.bindRoutes([
            {
                path: REST_API.USER.GET_ME,
                method: 'get',
                func: this.info,
                middlewares: [new AuthGuard()],
            },
        ]);
    }

    public async info(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { user } = req;
            const userInfo = await this.userService.getUserInfo(user.uuid);
            const entity = errorHandler(userInfo);
            const response: GetUserCommand.Response = {
                data: {
                    user: new UserResponseModel(entity),
                },
            };
            this.ok(res, response);
        } catch (error) {
            next(error);
        }
    }
}
