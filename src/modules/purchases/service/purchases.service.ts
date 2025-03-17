import { inject, injectable } from 'inversify';

import { DecrementBalanceCommand } from '../../user-balance/commands/decrement-balance/decrement-balance.command';
import { DecrementQuantityCommand } from '../../products/commands/decrement-quantity/decrement-quantity.command';
import { GetProductByUuidQuery } from '../../products/queries/get-product-by-uuid/get-product-by-uuid.query';
import { GetUserByUuidQuery } from '../../users/queries/get-user-by-uuid/get-user-by-uuid.query';
import { IPurchasesRepository } from '../repository/interfaces/purchases.repository.interface';
import { ICommandResponse } from '../../../common/types/command-response.type';
import { ILogger } from '../../../common/logger/interfaces/logger.interface';
import { IPurchaseService } from './interfaces/purchases.service.interface';
import { ProductEntity } from '../../products/entities/product.entity';
import { UserBalanceEntity } from '../../user-balance/entities';
import { IPurchase } from './interfaces/purchases.interface';
import { PurchaseEntity } from '../entities/purchase.entity';
import { CommandBus, QueryBus } from '../../../common/cqrs';
import { ERRORS } from '../../../../libs/contract';
import { UserEntity } from '../../users/entities';
import { PURCHASE_MODULES } from '../types';
import { TYPES } from '../../../types';

@injectable()
export class PurchaseService implements IPurchaseService {
    constructor(
        @inject(PURCHASE_MODULES.PurchasesRepository)
        private purchasesRepository: IPurchasesRepository,
        @inject(TYPES.CommandBus)
        private commandBus: CommandBus,
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.QueryBus) private queryBus: QueryBus,
    ) {}

    public async purchase(dto: IPurchase): Promise<ICommandResponse<number>> {
        const { userUuid, productUuid, quantity } = dto;
        try {
            const user = await this.getUser(userUuid);
            if (!user.isSuccess || !user.data) {
                return {
                    isSuccess: false,
                    ...ERRORS.USER_NOT_FOUND,
                };
            }

            const product = await this.getProduct(productUuid);
            if (!product.isSuccess || !product.data) {
                return {
                    isSuccess: false,
                    ...ERRORS.PRODUCT_NOT_FOUND,
                };
            }

            if (product.data.quantity < quantity) {
                return {
                    isSuccess: false,
                    ...ERRORS.INSUFFICIENT_QUANTITY,
                };
            }

            const userBalance = user.data.userBalance.balance;
            const totalPrice = product.data.suggestedPrice * quantity;
            if (userBalance < totalPrice) {
                return {
                    isSuccess: false,
                    ...ERRORS.INSUFFICIENT_BALANCE_FOR_PURCHASE,
                };
            }

            const decrementBalanceResponse = await this.decrementUserBalance(userUuid, totalPrice);
            if (!decrementBalanceResponse.isSuccess || !decrementBalanceResponse.data) {
                return {
                    isSuccess: false,
                    ...ERRORS.INTERNAL_SERVER_ERROR,
                };
            }

            await this.decrementProductQuantity(productUuid, quantity);
            const purchaseEntity = new PurchaseEntity({
                productUuid,
                userUuid,
                quantity,
            });
            await this.purchasesRepository.create(purchaseEntity);

            return {
                isSuccess: true,
                data: decrementBalanceResponse.data.balance,
            };
        } catch (error) {
            this.logger.error('[PurchaseService] Error purchasing product:', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }

    private async getUser(uuid: string): Promise<ICommandResponse<UserEntity>> {
        return this.queryBus.execute<GetUserByUuidQuery, ICommandResponse<UserEntity>>(
            new GetUserByUuidQuery(uuid),
        );
    }

    private async decrementUserBalance(
        userUuid: string,
        amount: number,
    ): Promise<ICommandResponse<UserBalanceEntity>> {
        return this.commandBus.execute<
            DecrementBalanceCommand,
            ICommandResponse<UserBalanceEntity>
        >(new DecrementBalanceCommand(userUuid, amount));
    }

    private async getProduct(uuid: string): Promise<ICommandResponse<null | ProductEntity>> {
        return this.queryBus.execute<GetProductByUuidQuery, ICommandResponse<null | ProductEntity>>(
            new GetProductByUuidQuery(uuid),
        );
    }

    private async decrementProductQuantity(
        uuid: string,
        quantity: number,
    ): Promise<ICommandResponse<number>> {
        return this.commandBus.execute<DecrementQuantityCommand, ICommandResponse<number>>(
            new DecrementQuantityCommand(uuid, quantity),
        );
    }
}
