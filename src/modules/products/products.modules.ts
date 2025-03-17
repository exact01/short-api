import { ContainerModule } from 'inversify';
import { Products } from '@prisma/client';

import { IncrementQuantityHandler } from './commands/increment-quantity/increment-quantity.handler';
import { DecrementQuantityHandler } from './commands/decrement-quantity/decrement-quantity.handler';
import { GetProductByUuidHandler } from './queries/get-product-by-uuid/get-product-by-uuid.handler';
import { IProductsRepository } from './repository/interfaces/products.repository.interface';
import { IProductController } from './controller/interfaces/products.controller.interface';
import { CreateProductHandler } from './commands/create-product/create-product.handler';
import { CacheProductHandler } from './commands/cache-product/cache-product.handler';
import { IProductService } from './service/interfaces/products.service.interface';
import { ProductsRepository } from './repository/product.repository';
import { ProductController } from './controller/products.controller';
import { UniversalConverter } from '../../common/converter';
import { ProductService } from './service/products.service';
import { ProductEntity } from './entities/product.entity';
import { ProductConverter } from './products.converter';
import { PRODUCT_MODULES } from './types';
export const productsBindings = new ContainerModule((bind) => {
    bind<IProductController>(PRODUCT_MODULES.ProductController).to(ProductController);
    bind<IProductService>(PRODUCT_MODULES.ProductService).to(ProductService);
    bind<IProductsRepository>(PRODUCT_MODULES.ProductsRepository).to(ProductsRepository);
    bind<UniversalConverter<ProductEntity, Products>>(PRODUCT_MODULES.ProductConverter)
        .to(ProductConverter)
        .inSingletonScope();

    // Register CQRS handlers
    bind(CreateProductHandler).toSelf().inSingletonScope();
    bind(IncrementQuantityHandler).toSelf().inSingletonScope();
    bind(DecrementQuantityHandler).toSelf().inSingletonScope();
    bind(CacheProductHandler).toSelf().inSingletonScope();
    bind(GetProductByUuidHandler).toSelf().inSingletonScope();
});
