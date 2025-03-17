import { inject } from 'inversify';

import { ProductsRepository } from '../../repository/product.repository';
import { IQueryHandler, QueryHandler } from '../../../../common/cqrs';
import { GetProductByUuidQuery } from './get-product-by-uuid.query';
import { ILogger } from '../../../../common/logger/interfaces';
import { ProductEntity } from '../../entities/product.entity';
import { ICommandResponse } from '../../../../common/types';
import { ERRORS } from '../../../../../libs/contract';
import { PRODUCT_MODULES } from '../../types';
import { TYPES } from '../../../../types';

@QueryHandler(GetProductByUuidQuery)
export class GetProductByUuidHandler
    implements IQueryHandler<GetProductByUuidQuery, ICommandResponse<null | ProductEntity>>
{
    constructor(
        @inject(PRODUCT_MODULES.ProductsRepository) private productsRepository: ProductsRepository,
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {}

    async execute(query: GetProductByUuidQuery): Promise<ICommandResponse<null | ProductEntity>> {
        try {
            const product = await this.productsRepository.findByUUID(query.uuid);

            return {
                isSuccess: true,
                data: product,
            };
        } catch (error) {
            this.logger.error('[GetProductByUuidHandler] Error getting product by UUID', error);
            return {
                isSuccess: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
