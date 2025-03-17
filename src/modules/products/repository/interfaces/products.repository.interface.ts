import { ProductEntity } from '../../entities/product.entity';
import { ICrud } from '../../../../common/types/crud-port';

export interface IProductsRepository extends ICrud<ProductEntity> {
    decrementQuantity(uuid: string, decrement: number): Promise<ProductEntity>;
    findByMarketHashName(marketHashName: string): Promise<null | ProductEntity>;
    incrementQuantity(uuid: string, increment: number): Promise<ProductEntity>;
}
