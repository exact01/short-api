import { Products } from '@prisma/client';
import { injectable } from 'inversify';

import { UniversalConverter } from '../../common/converter';
import { ProductEntity } from './entities/product.entity';

const modelToEntity = (prismaModel: Products): ProductEntity => {
    return new ProductEntity(prismaModel);
};

const entityToModel = (entity: ProductEntity): Products => {
    return {
        uuid: entity.uuid,
        marketHashName: entity.marketHashName,
        currency: entity.currency,
        suggestedPrice: entity.suggestedPrice,
        itemPage: entity.itemPage,
        marketPage: entity.marketPage,
        minPrice: entity.minPrice,
        maxPrice: entity.maxPrice,
        meanPrice: entity.meanPrice,
        medianPrice: entity.medianPrice,
        quantity: entity.quantity,

        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
    };
};

@injectable()
export class ProductConverter extends UniversalConverter<ProductEntity, Products> {
    constructor() {
        super(modelToEntity, entityToModel);
    }
}
