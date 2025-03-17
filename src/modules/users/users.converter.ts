import { injectable } from 'inversify';
import { User } from '@prisma/client';

import { UniversalConverter } from '../../common/converter';
import { UserEntity } from './entities';

const modelToEntity = (model: User): UserEntity => {
    return new UserEntity(model);
};

const entityToModel = (entity: UserEntity): User => {
    return {
        uuid: entity.uuid,
        email: entity.email,
        password: entity.password,

        updatedAt: entity.updatedAt,
        createdAt: entity.createdAt,
    };
};

@injectable()
export class UserConverter extends UniversalConverter<UserEntity, User> {
    constructor() {
        super(modelToEntity, entityToModel);
    }
}
