import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { PurchaseCommand } from '../../../../libs/contract/commands/purhases/purchases.command';
import { ValidateBodyMiddleware } from '../../../common/middlewaries/validate-body.middleware';

import 'reflect-metadata';

import { IPurchaseService } from '../service/interfaces/purchases.service.interface';
import { IPurchasesController } from './interfaces/purchses.controller.interface';
import { ILogger } from '../../../common/logger/interfaces/logger.interface';
import { errorHandler } from '../../../common/helpers/error-handler.helper';
import { BaseController } from '../../../common/contoller/base.controller';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { REST_API } from '../../../../libs/contract';
import { PURCHASE_MODULES } from '../types';
import { TYPES } from '../../../types';

@injectable()
export class PurchasesController extends BaseController implements IPurchasesController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(PURCHASE_MODULES.PurchaseService) private purchaseService: IPurchaseService,
    ) {
        super(loggerService);
        this.loggerService.log('[PurchasesController] Routes initialized successfully');
        this.bindRoutes([
            {
                path: REST_API.PURCHASES.CREATE,
                method: 'post',
                func: this.purchase,
                middlewares: [
                    new AuthGuard(),
                    new ValidateBodyMiddleware(PurchaseCommand.RequestSchema),
                ],
            },
        ]);
    }

    public async purchase(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { user } = req;
            const body = req.body as unknown as PurchaseCommand.Request;
            const purchaseInfo = await this.purchaseService.purchase({
                productUuid: body.productUuid,
                quantity: body.quantity,
                userUuid: user.uuid,
            });
            const entity = errorHandler(purchaseInfo);
            const response: PurchaseCommand.Response = {
                data: {
                    userBalance: entity,
                },
            };
            this.ok(res, response);
        } catch (error) {
            next(error);
        }
    }
}
