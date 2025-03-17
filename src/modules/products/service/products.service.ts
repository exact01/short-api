import { inject, injectable } from 'inversify';
import { MD5 } from 'crypto-js';

import { SetRedisValueCommand } from '../../../integration-modules/redis/commands/set-value/set-value.command';
import { GetRedisValueQuery } from '../../../integration-modules/redis/queries/get-value/get-value.query';
import { IProductsRepository } from '../repository/interfaces/products.repository.interface';
import { ICommandResponse } from '../../../common/types/command-response.type';
import { ILogger } from '../../../common/logger/interfaces/logger.interface';
import { IProductService } from './interfaces/products.service.interface';
import { CreateProductCommand, ERRORS } from '../../../../libs/contract';
import { ICommandBus, IQueryBus } from '../../../common/cqrs';
import { ProductEntity } from '../entities/product.entity';
import { PRODUCT_MODULES } from '../types';
import { TYPES } from '../../../types';

@injectable()
export class ProductService implements IProductService {
    private readonly key: string;
    private readonly ttl: number;
    constructor(
        @inject(PRODUCT_MODULES.ProductsRepository) private productsRepository: IProductsRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.CommandBus) private commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private queryBus: IQueryBus,
    ) {
        this.key = MD5(ProductService.name).toString();
        this.ttl = 60; // 1min;
    }

    public async createProduct(
        dto: CreateProductCommand.Request,
    ): Promise<ICommandResponse<ProductEntity>> {
        try {
            const newEntity = new ProductEntity(dto);
            const product = await this.productsRepository.create(newEntity);
            return {
                isSuccess: true,
                data: product,
            };
        } catch (error) {
            this.logger.error('[ProductService] Error creating product', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }

    public async getProductByUUID(uuid: string): Promise<ICommandResponse<ProductEntity>> {
        try {
            const product = await this.productsRepository.findByUUID(uuid);
            if (!product) {
                return {
                    isSuccess: false,
                    ...ERRORS.PRODUCT_NOT_FOUND,
                };
            }

            return {
                isSuccess: true,
                data: product,
            };
        } catch (error) {
            this.logger.error('[ProductService] Error getting product by UUID', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }

    public async getAllProducts(): Promise<ICommandResponse<ProductEntity[]>> {
        try {
            const { data, isSuccess } = await this.getProductsFromCache();

            if (isSuccess && data) {
                return { isSuccess: true, data };
            }

            const products = await this.productsRepository.findByCriteria({});

            const { isSuccess: isSuccessCache } = await this.setCacheProducts(products);

            if (!isSuccessCache) {
                return {
                    isSuccess: false,
                    ...ERRORS.INTERNAL_SERVER_ERROR,
                };
            }

            return {
                isSuccess: true,
                data: products,
            };
        } catch (error) {
            this.logger.error('[ProductService] Error getting all products', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }

    public async deleteProduct(uuid: string): Promise<ICommandResponse<boolean>> {
        try {
            const product = await this.productsRepository.findByUUID(uuid);
            if (!product) {
                return {
                    isSuccess: false,
                    ...ERRORS.PRODUCT_NOT_FOUND,
                };
            }

            const result = await this.productsRepository.deleteByUUID(uuid);
            return {
                isSuccess: true,
                data: result,
            };
        } catch (error) {
            this.logger.error('[ProductService] Error deleting product', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }

    private async getProductsFromCache(): Promise<ICommandResponse<null | ProductEntity[]>> {
        const { data, isSuccess } = await this.queryBus.execute<
            GetRedisValueQuery,
            ICommandResponse<null | string>
        >(new GetRedisValueQuery(this.key));

        if (!isSuccess) {
            return { isSuccess: false, ...ERRORS.INTERNAL_SERVER_ERROR };
        }

        if (data) {
            return { isSuccess: true, data: JSON.parse(data) as ProductEntity[] };
        }

        return { isSuccess: true, data: null };
    }

    private async setCacheProducts(products: ProductEntity[]): Promise<ICommandResponse<boolean>> {
        const { isSuccess } = await this.commandBus.execute<
            SetRedisValueCommand,
            ICommandResponse<boolean>
        >(new SetRedisValueCommand(this.key, JSON.stringify(products), this.ttl));

        return { isSuccess };
    }
}
