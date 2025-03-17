import { IUsersWithBalance } from './interfaces/user-with-balance.interface';
import { UserBalanceEntity } from '../../user-balance/entities';

export class UserEntity implements IUsersWithBalance {
    public uuid: string;
    public email: string;
    public password: string;
    public createdAt: Date;
    public updatedAt: Date;
    public userBalance: UserBalanceEntity;

    constructor(user: Partial<IUsersWithBalance>) {
        if (user.userBalance) {
            this.userBalance = new UserBalanceEntity(user.userBalance);
        }
        Object.assign(this, user);
        return this;
    }
}
