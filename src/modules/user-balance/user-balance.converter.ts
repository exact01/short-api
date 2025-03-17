import { UserBalance } from '@prisma/client';
import { injectable } from 'inversify';

import { UserBalanceEntity } from './entities/user-balance.entity';
import { UniversalConverter } from '../../common/converter';

const modelToEntity = (model: UserBalance): UserBalanceEntity => {
    return new UserBalanceEntity(model);
};

const entityToModel = (entity: UserBalanceEntity): UserBalance => {
    return {
        uuid: entity.uuid,
        balance: entity.balance,
        userUuid: entity.userUuid,

        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
    };
};

@injectable()
export class UserBalanceConverter extends UniversalConverter<UserBalanceEntity, UserBalance> {
    constructor() {
        super(modelToEntity, entityToModel);
    }
}
