import { Purchases } from '@prisma/client';
import { injectable } from 'inversify';

import { UniversalConverter } from '../../common/converter';
import { PurchaseEntity } from './entities/purchase.entity';

const modelToEntity = (model: Purchases): PurchaseEntity => {
    return new PurchaseEntity(model);
};

const entityToModel = (entity: PurchaseEntity): Purchases => {
    return {
        uuid: entity.uuid,
        productUuid: entity.productUuid,
        userUuid: entity.userUuid,
        quantity: entity.quantity,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
    };
};

@injectable()
export class PurchaseConverter extends UniversalConverter<PurchaseEntity, Purchases> {
    constructor() {
        super(modelToEntity, entityToModel);
    }
}
