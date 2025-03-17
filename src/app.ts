import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import 'reflect-metadata';
import { json } from 'body-parser';
import { Server } from 'http';

import { PurchasesController } from './modules/purchases/controller/purchases.controller';
import { IExeptionFilter } from './common/errors/interfaces/exeption.filter.interface';
import { ProductController } from './modules/products/controller/products.controller';
import { IConfigService } from './common/config/interfaces/config.service.interface';
import { UserController } from './modules/users/controller/users.controller';
import { AuthController } from './modules/auth/controller/auth.controller';
import { AuthMiddleware } from './common/middlewaries/auth.middleware';
import { ILogger } from './common/logger/interfaces/logger.interface';
import { PrismaService } from './common/database/prisma.service';
import { USER_MODULES } from './modules/users/users.modules';
import { PURCHASE_MODULES } from './modules/purchases/types';
import { AUTH_MODULES } from './modules/auth/auth.modules';
import { PRODUCT_MODULES } from './modules/products/types';
import { TYPES } from './types';

@injectable()
export class App {
    public app: Express;
    public server!: Server;
    public port: number;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
        @inject(USER_MODULES.UserController) private userController: UserController,
        @inject(AUTH_MODULES.AuthController) private authController: AuthController,
        @inject(PRODUCT_MODULES.ProductController) private productController: ProductController,
        @inject(PURCHASE_MODULES.PurchasesController)
        private purchaseController: PurchasesController,
    ) {
        this.app = express();
        this.port = Number(this.configService.getOrThrow('APP_PORT'));
    }

    private useMiddleware(): void {
        this.app.use(json());
        const authMiddleware = new AuthMiddleware(this.configService.getOrThrow('JWT_SECRET'));
        this.app.use(authMiddleware.execute.bind(authMiddleware));
    }

    private useRoutes(): void {
        this.app.use('', this.userController.router);
        this.app.use('', this.authController.router);
        this.app.use('', this.productController.router);
        this.app.use('', this.purchaseController.router);
    }

    private useExeptionFilters(): void {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
    }

    public async init(): Promise<void> {
        this.useMiddleware();
        this.useRoutes();
        this.useExeptionFilters();
        await this.prismaService.connect();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server is running on http://localhost:${this.port}`);
    }

    public close(): void {
        this.server.close();
    }
}
