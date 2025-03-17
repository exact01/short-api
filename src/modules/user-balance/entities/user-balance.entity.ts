import { UserBalance } from '@prisma/client';

export class UserBalanceEntity implements UserBalance {
    public uuid: string;
    public balance: number;
    public userUuid: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(userBalance: Partial<UserBalance>) {
        Object.assign(this, userBalance);
        return this;
    }
}
