import { UserBalanceEntity } from '../../entities/user-balance.entity';
import { ICrud } from '../../../../common/types';

export interface IUserBalanceRepository extends ICrud<UserBalanceEntity> {
    decrementBalance(userUuid: string, amount: number): Promise<UserBalanceEntity>;
    findByUserUuid(userUuid: string): Promise<null | UserBalanceEntity>;
    incrementBalance(userUuid: string, amount: number): Promise<UserBalanceEntity>;
}
