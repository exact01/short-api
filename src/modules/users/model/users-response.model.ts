import { UserEntity } from '../entities';

export class UserResponseModel {
    public uuid: string;
    public email: string;
    public balance: number;

    constructor(entity: UserEntity) {
        this.uuid = entity.uuid;
        this.email = entity.email;
        this.balance = entity.userBalance.balance;
    }
}
