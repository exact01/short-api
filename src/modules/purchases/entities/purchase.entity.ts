import { Purchases } from '@prisma/client';

export class PurchaseEntity {
    public uuid: string;
    public productUuid: string;
    public userUuid: string;
    public quantity: number;

    public createdAt: Date;
    public updatedAt: Date;

    constructor(purchase: Partial<Purchases>) {
        Object.assign(this, purchase);
        return this;
    }
}
