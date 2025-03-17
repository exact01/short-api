import { ICommandResponse } from '../../../../common/types/command-response.type';
import { ProductEntity } from '../../entities/product.entity';

export interface IProductService {
    createProduct: (
        dto: Omit<ProductEntity, 'createdAt' | 'updatedAt' | 'uuid'>,
    ) => Promise<ICommandResponse<ProductEntity>>;
    deleteProduct: (uuid: string) => Promise<ICommandResponse<boolean>>;
    getAllProducts: () => Promise<ICommandResponse<ProductEntity[]>>;
    getProductByUUID: (uuid: string) => Promise<ICommandResponse<ProductEntity>>;
}
