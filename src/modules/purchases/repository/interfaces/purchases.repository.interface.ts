import { PurchaseEntity } from '../../entities/purchase.entity';

export interface IPurchasesRepository {
    create(entity: PurchaseEntity): Promise<PurchaseEntity>;
    findByCriteria(dto: Partial<PurchaseEntity>): Promise<PurchaseEntity[]>;
    findByProductUUID(productUuid: string): Promise<PurchaseEntity[]>;
    findByUserUUID(userUuid: string): Promise<PurchaseEntity[]>;
    findByUUID(uuid: string): Promise<null | PurchaseEntity>;
}
