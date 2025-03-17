import { inject } from 'inversify';

import { IProductsRepository } from '../../repository/interfaces/products.repository.interface';
import { CommandHandler } from '../../../../common/cqrs/decorators/command-handler.decorator';
import { ICommandResponse } from '../../../../common/types/command-response.type';
import { ILogger } from '../../../../common/logger/interfaces/logger.interface';
import { IncrementQuantityCommand } from './increment-quantity.command';
import { ProductEntity } from '../../entities/product.entity';
import { ICommandHandler } from '../../../../common/cqrs';
import { ERRORS } from '../../../../../libs/contract';
import { PRODUCT_MODULES } from '../../types';
import { TYPES } from '../../../../types';

@CommandHandler(IncrementQuantityCommand)
export class IncrementQuantityHandler
    implements ICommandHandler<IncrementQuantityCommand, ICommandResponse<ProductEntity>>
{
    constructor(
        @inject(PRODUCT_MODULES.ProductsRepository)
        private productsRepository: IProductsRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {}

    public async execute(
        command: IncrementQuantityCommand,
    ): Promise<ICommandResponse<ProductEntity>> {
        try {
            const { uuid, increment } = command;

            const product = await this.productsRepository.findByUUID(uuid);
            if (!product) {
                return {
                    isSuccess: false,
                    ...ERRORS.PRODUCT_NOT_FOUND,
                };
            }

            const updated = await this.productsRepository.incrementQuantity(uuid, increment);

            return {
                isSuccess: true,
                data: updated,
            };
        } catch (error) {
            this.logger.error('[IncrementQuantityHandler] Error incrementing quantity:', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
