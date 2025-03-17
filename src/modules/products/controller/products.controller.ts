import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import {
    CreateProductCommand,
    DeleteProductCommand,
    GetAllProductsCommand,
    GetByUUIDProductsCommand,
    REST_API,
} from '../../../../libs/contract';
import { ValidateParamsMiddleware } from '../../../common/middlewaries/validate-params.middleware';
import { ValidateBodyMiddleware } from '../../../common/middlewaries/validate-body.middleware';
import { IProductService } from '../service/interfaces/products.service.interface';
import { IProductController } from './interfaces/products.controller.interface';
import { ILogger } from '../../../common/logger/interfaces/logger.interface';
import { errorHandler } from '../../../common/helpers/error-handler.helper';
import { BaseController } from '../../../common/contoller/base.controller';
import { ProductResponseModel } from '../model/products-response.model';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { PRODUCT_MODULES } from '../types';
import { TYPES } from '../../../types';

@injectable()
export class ProductController extends BaseController implements IProductController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(PRODUCT_MODULES.ProductService) private productService: IProductService,
    ) {
        super(loggerService);
        this.loggerService.log('[ProductController] Routes initialized successfully');
        this.bindRoutes([
            {
                path: REST_API.PRODUCTS.CREATE,
                method: 'post',
                func: this.create,
                middlewares: [
                    new AuthGuard(),
                    new ValidateBodyMiddleware(CreateProductCommand.RequestSchema),
                ],
            },
            {
                path: `${REST_API.PRODUCTS.GET_BY_UUID}/:uuid`,
                method: 'get',
                func: this.getByUUID,
                middlewares: [
                    new AuthGuard(),
                    new ValidateParamsMiddleware(GetByUUIDProductsCommand.RequestSchema),
                ],
            },
            {
                path: REST_API.PRODUCTS.GET_ALL,
                method: 'get',
                func: this.getAll,
                middlewares: [new AuthGuard()],
            },
            {
                path: `${REST_API.PRODUCTS.DELETE}/:uuid`,
                method: 'delete',
                func: this.delete,
                middlewares: [
                    new AuthGuard(),
                    new ValidateParamsMiddleware(DeleteProductCommand.RequestSchema),
                ],
            },
        ]);
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = req.body as CreateProductCommand.Request;
            const result = await this.productService.createProduct(body);
            const product = errorHandler(result);
            const productResponseModel: CreateProductCommand.Response = {
                data: {
                    product: new ProductResponseModel(product),
                },
            };
            this.ok(res, productResponseModel);
        } catch (error) {
            next(error);
        }
    }

    public async getByUUID(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { uuid } = req.params as GetByUUIDProductsCommand.Request;
            const result = await this.productService.getProductByUUID(uuid);
            const product = errorHandler(result);
            const productResponseModel: GetByUUIDProductsCommand.Response = {
                data: {
                    product: new ProductResponseModel(product),
                },
            };
            this.ok(res, productResponseModel);
        } catch (error) {
            next(error);
        }
    }

    public async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.productService.getAllProducts();
            const products = errorHandler(result);
            const productResponseModels: GetAllProductsCommand.Response = {
                data: {
                    products: products.map((p) => new ProductResponseModel(p)),
                },
            };
            this.ok(res, productResponseModels);
        } catch (error) {
            next(error);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { uuid } = req.params as DeleteProductCommand.Request;
            const result = await this.productService.deleteProduct(uuid);
            errorHandler(result);
            this.ok(res, { data: { success: true } });
        } catch (error) {
            next(error);
        }
    }
}
