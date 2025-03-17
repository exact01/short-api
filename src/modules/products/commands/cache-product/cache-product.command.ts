import { BaseCommand, Command } from '../../../../common/cqrs';
import { ProductEntity } from '../../entities/product.entity';

@Command('CACHE_PRODUCT')
export class CacheProductCommand extends BaseCommand {
    readonly type = 'CACHE_PRODUCT';

    constructor(
        public readonly product: ProductEntity,
        public readonly ttlSeconds?: number,
    ) {
        super();
    }
}
