import { inject, injectable } from 'inversify';
import { User } from '@prisma/client';

import { PrismaService } from '../../../common/database/prisma.service';
import { UniversalConverter } from '../../../common/converter';
import { IUsersRepository } from './interfaces';
import { UserEntity } from '../entities';
import { USER_MODULES } from '../types';
import { TYPES } from '../../../types';

@injectable()
export class UsersRepository implements IUsersRepository {
    constructor(
        @inject(TYPES.PrismaService) private prisma: PrismaService,
        @inject(USER_MODULES.UserConverter)
        private userConverter: UniversalConverter<UserEntity, User>,
    ) {}

    public async create(entity: UserEntity): Promise<UserEntity> {
        const model = this.userConverter.fromEntityToPrismaModel(entity);
        const result = await this.prisma.client.user.create({
            data: {
                ...model,
            },
        });

        return this.userConverter.fromPrismaModelToEntity(result);
    }

    public async findByEmail(email: string): Promise<null | UserEntity> {
        const result = await this.prisma.client.user.findUnique({
            where: { email },
            include: { userBalance: true },
        });
        if (!result) {
            return null;
        }
        return this.userConverter.fromPrismaModelToEntity(result);
    }

    public async findByUUID(uuid: string): Promise<null | UserEntity> {
        const result = await this.prisma.client.user.findUnique({
            where: { uuid },
            include: { userBalance: true },
        });
        if (!result) {
            return null;
        }
        return this.userConverter.fromPrismaModelToEntity(result);
    }

    public async update({ uuid, ...data }: Partial<UserEntity>): Promise<UserEntity> {
        const result = await this.prisma.client.user.update({
            where: {
                uuid,
            },
            data: {
                email: data?.email,
                password: data?.password,

                createdAt: data?.createdAt,
                updatedAt: data?.updatedAt,
            },
            include: {
                userBalance: true,
            },
        });

        return this.userConverter.fromPrismaModelToEntity(result);
    }

    public async findByCriteria(dto: Partial<UserEntity>): Promise<UserEntity[]> {
        const bannerList = await this.prisma.client.user.findMany({
            where: dto,
            include: { userBalance: true },
        });
        return this.userConverter.fromPrismaModelsToEntities(bannerList);
    }

    public async deleteByUUID(uuid: string): Promise<boolean> {
        const result = await this.prisma.client.user.delete({
            where: { uuid },
            include: { userBalance: true },
        });
        return !!result;
    }
}
