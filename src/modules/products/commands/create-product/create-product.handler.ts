import { inject } from 'inversify';

import { CommandHandler, ICommandHandler } from '../../../../common/cqrs';
import { ProductsRepository } from '../../repository/product.repository';
import { CreateProductCommand } from './create-product.command';
import { ILogger } from '../../../../common/logger/interfaces';
import { ProductEntity } from '../../entities/product.entity';
import { ICommandResponse } from '../../../../common/types';
import { ERRORS } from '../../../../../libs/contract';
import { PRODUCT_MODULES } from '../../types';
import { TYPES } from '../../../../types';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
    implements ICommandHandler<CreateProductCommand, ICommandResponse<ProductEntity>>
{
    constructor(
        @inject(PRODUCT_MODULES.ProductsRepository) private productsRepository: ProductsRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {}

    async execute(command: CreateProductCommand): Promise<ICommandResponse<ProductEntity>> {
        try {
            const productEntity = new ProductEntity({
                marketHashName: command.marketHashName,
                currency: command.currency,
                suggestedPrice: command.suggestedPrice,
                itemPage: command.itemPage,
                marketPage: command.marketPage,
                minPrice: command.minPrice,
                maxPrice: command.maxPrice,
                meanPrice: command.meanPrice,
                medianPrice: command.medianPrice,
                quantity: command.quantity,
            });

            const product = await this.productsRepository.create(productEntity);

            return {
                isSuccess: true,
                data: product,
            };
        } catch (error) {
            this.logger.error('[CreateProductHandler] Error creating product', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
