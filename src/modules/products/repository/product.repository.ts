import { inject, injectable } from 'inversify';
import { Products } from '@prisma/client';

import { IProductsRepository } from './interfaces/products.repository.interface';
import { PrismaService } from '../../../common/database/prisma.service';
import { UniversalConverter } from '../../../common/converter';
import { ProductEntity } from '../entities/product.entity';
import { PRODUCT_MODULES } from '../types';
import { TYPES } from '../../../types';

@injectable()
export class ProductsRepository implements IProductsRepository {
    constructor(
        @inject(TYPES.PrismaService) private prisma: PrismaService,
        @inject(PRODUCT_MODULES.ProductConverter)
        private productConverter: UniversalConverter<ProductEntity, Products>,
    ) {}

    public async create(entity: ProductEntity): Promise<ProductEntity> {
        const model = this.productConverter.fromEntityToPrismaModel(entity);
        const result = await this.prisma.client.products.create({
            data: {
                ...model,
            },
        });

        return this.productConverter.fromPrismaModelToEntity(result);
    }

    public async findByMarketHashName(marketHashName: string): Promise<null | ProductEntity> {
        const result = await this.prisma.client.products.findFirst({
            where: { marketHashName },
        });
        if (!result) {
            return null;
        }
        return this.productConverter.fromPrismaModelToEntity(result);
    }

    public async findByUUID(uuid: string): Promise<null | ProductEntity> {
        const result = await this.prisma.client.products.findUnique({
            where: { uuid },
        });
        if (!result) {
            return null;
        }
        return this.productConverter.fromPrismaModelToEntity(result);
    }

    public async update({ uuid, ...data }: Partial<ProductEntity>): Promise<ProductEntity> {
        const result = await this.prisma.client.products.update({
            where: {
                uuid,
            },
            data: {
                marketHashName: data?.marketHashName,
                currency: data?.currency,
                suggestedPrice: data?.suggestedPrice,
                itemPage: data?.itemPage,
                marketPage: data?.marketPage,
                minPrice: data?.minPrice,
                maxPrice: data?.maxPrice,
                meanPrice: data?.meanPrice,
                medianPrice: data?.medianPrice,
                quantity: data?.quantity,
                createdAt: data?.createdAt,
                updatedAt: data?.updatedAt,
            },
        });

        return this.productConverter.fromPrismaModelToEntity(result);
    }

    public async findByCriteria(dto: Partial<ProductEntity>): Promise<ProductEntity[]> {
        const productList = await this.prisma.client.products.findMany({
            where: dto,
        });
        return this.productConverter.fromPrismaModelsToEntities(productList);
    }

    public async deleteByUUID(uuid: string): Promise<boolean> {
        const result = await this.prisma.client.products.delete({ where: { uuid } });
        return !!result;
    }

    public async incrementQuantity(uuid: string, increment: number): Promise<ProductEntity> {
        const result = await this.prisma.client.products.update({
            where: { uuid },
            data: { quantity: { increment } },
        });
        return this.productConverter.fromPrismaModelToEntity(result);
    }

    public async decrementQuantity(uuid: string, decrement: number): Promise<ProductEntity> {
        const result = await this.prisma.client.products.update({
            where: { uuid },
            data: { quantity: { decrement } },
        });
        return this.productConverter.fromPrismaModelToEntity(result);
    }
}
