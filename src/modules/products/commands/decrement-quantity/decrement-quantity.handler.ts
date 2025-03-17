import { inject } from 'inversify';

import { IProductsRepository } from '../../repository/interfaces/products.repository.interface';
import { CommandHandler } from '../../../../common/cqrs/decorators/command-handler.decorator';
import { ICommandResponse } from '../../../../common/types/command-response.type';
import { ILogger } from '../../../../common/logger/interfaces/logger.interface';
import { DecrementQuantityCommand } from './decrement-quantity.command';
import { ProductEntity } from '../../entities/product.entity';
import { ICommandHandler } from '../../../../common/cqrs';
import { ERRORS } from '../../../../../libs/contract';
import { PRODUCT_MODULES } from '../../types';
import { TYPES } from '../../../../types';

@CommandHandler(DecrementQuantityCommand)
export class DecrementQuantityHandler
    implements ICommandHandler<DecrementQuantityCommand, ICommandResponse<ProductEntity>>
{
    constructor(
        @inject(PRODUCT_MODULES.ProductsRepository)
        private productsRepository: IProductsRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {}

    public async execute(
        command: DecrementQuantityCommand,
    ): Promise<ICommandResponse<ProductEntity>> {
        try {
            const { uuid, decrement } = command;

            const product = await this.productsRepository.findByUUID(uuid);
            if (!product) {
                return {
                    isSuccess: false,
                    ...ERRORS.PRODUCT_NOT_FOUND,
                };
            }

            const updated = await this.productsRepository.decrementQuantity(uuid, decrement);

            return {
                isSuccess: true,
                data: updated,
            };
        } catch (error) {
            this.logger.error('[DecrementQuantityHandler] Error decrementing quantity:', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
