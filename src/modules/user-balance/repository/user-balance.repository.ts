import { inject, injectable } from 'inversify';
import { UserBalance } from '@prisma/client';

import { IUserBalanceRepository } from './interfaces/user-balance.repository.interface';
import { PrismaService } from '../../../common/database/prisma.service';
import { UserBalanceEntity } from '../entities/user-balance.entity';
import { UniversalConverter } from '../../../common/converter';
import { USER_BALANCE_MODULES } from '../types';
import { TYPES } from '../../../types';

@injectable()
export class UserBalanceRepository implements IUserBalanceRepository {
    constructor(
        @inject(TYPES.PrismaService) private prisma: PrismaService,
        @inject(USER_BALANCE_MODULES.UserBalanceConverter)
        private userBalanceConverter: UniversalConverter<UserBalanceEntity, UserBalance>,
    ) {}

    public async create(userBalanceEntity: UserBalanceEntity): Promise<UserBalanceEntity> {
        const created = await this.prisma.client.userBalance.create({
            data: userBalanceEntity,
        });
        return this.userBalanceConverter.fromPrismaModelToEntity(created);
    }

    public async findByUserUuid(userUuid: string): Promise<null | UserBalanceEntity> {
        const balance = await this.prisma.client.userBalance.findFirst({
            where: { userUuid },
        });
        return balance ? this.userBalanceConverter.fromPrismaModelToEntity(balance) : null;
    }

    public async update(balance: UserBalanceEntity): Promise<UserBalanceEntity> {
        const updated = await this.prisma.client.userBalance.update({
            where: { uuid: balance.uuid },
            data: balance,
        });
        return this.userBalanceConverter.fromPrismaModelToEntity(updated);
    }

    public async deleteByUUID(uuid: string): Promise<boolean> {
        const deleted = await this.prisma.client.userBalance.delete({
            where: { uuid },
        });
        return deleted !== null;
    }

    public async findByUUID(uuid: string): Promise<null | UserBalanceEntity> {
        const balance = await this.prisma.client.userBalance.findUnique({
            where: { uuid },
        });
        return balance ? this.userBalanceConverter.fromPrismaModelToEntity(balance) : null;
    }

    public async findByCriteria(dto: Partial<UserBalanceEntity>): Promise<UserBalanceEntity[]> {
        const bannerList = await this.prisma.client.userBalance.findMany({
            where: dto,
        });
        return this.userBalanceConverter.fromPrismaModelsToEntities(bannerList);
    }

    public async incrementBalance(userUuid: string, amount: number): Promise<UserBalanceEntity> {
        const balance = await this.prisma.client.userBalance.update({
            where: { userUuid },
            data: { balance: { increment: amount } },
        });
        return this.userBalanceConverter.fromPrismaModelToEntity(balance);
    }

    public async decrementBalance(userUuid: string, amount: number): Promise<UserBalanceEntity> {
        const balance = await this.prisma.client.userBalance.update({
            where: { userUuid },
            data: { balance: { decrement: amount } },
        });
        return this.userBalanceConverter.fromPrismaModelToEntity(balance);
    }
}
