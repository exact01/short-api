import { ICrud } from '../../../../common/types/crud-port';
import { UserEntity } from '../../entities';

export interface IUsersRepository extends ICrud<UserEntity> {
    findByEmail: (email: string) => Promise<null | UserEntity>;
}
