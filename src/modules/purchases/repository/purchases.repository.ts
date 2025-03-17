import { inject, injectable } from 'inversify';
import { Purchases } from '@prisma/client';

import { IPurchasesRepository } from './interfaces/purchases.repository.interface';
import { PrismaService } from '../../../common/database/prisma.service';
import { UniversalConverter } from '../../../common/converter';
import { PurchaseEntity } from '../entities/purchase.entity';
import { PURCHASE_MODULES } from '../types';
import { TYPES } from '../../../types';

@injectable()
export class PurchasesRepository implements IPurchasesRepository {
    constructor(
        @inject(TYPES.PrismaService) private prisma: PrismaService,
        @inject(PURCHASE_MODULES.PurchaseConverter)
        private purchaseConverter: UniversalConverter<PurchaseEntity, Purchases>,
    ) {}

    public async create(entity: PurchaseEntity): Promise<PurchaseEntity> {
        const model = this.purchaseConverter.fromEntityToPrismaModel(entity);
        const result = await this.prisma.client.purchases.create({
            data: {
                ...model,
            },
            include: {
                User: true,
                Product: true,
            },
        });

        return this.purchaseConverter.fromPrismaModelToEntity(result);
    }

    public async findByUUID(uuid: string): Promise<null | PurchaseEntity> {
        const result = await this.prisma.client.purchases.findUnique({
            where: { uuid },
            include: {
                User: true,
                Product: true,
            },
        });

        if (!result) {
            return null;
        }

        return this.purchaseConverter.fromPrismaModelToEntity(result);
    }

    public async findByUserUUID(userUuid: string): Promise<PurchaseEntity[]> {
        const result = await this.prisma.client.purchases.findMany({
            where: { userUuid },
            include: {
                User: true,
                Product: true,
            },
        });

        return this.purchaseConverter.fromPrismaModelsToEntities(result);
    }

    public async findByProductUUID(productUuid: string): Promise<PurchaseEntity[]> {
        const result = await this.prisma.client.purchases.findMany({
            where: { productUuid },
            include: {
                User: true,
                Product: true,
            },
        });

        return this.purchaseConverter.fromPrismaModelsToEntities(result);
    }

    public async findByCriteria(dto: Partial<PurchaseEntity>): Promise<PurchaseEntity[]> {
        const result = await this.prisma.client.purchases.findMany({
            where: dto,
            include: {
                User: true,
                Product: true,
            },
        });

        return this.purchaseConverter.fromPrismaModelsToEntities(result);
    }
}
