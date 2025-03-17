import { ContainerModule } from 'inversify';
import { Purchases } from '@prisma/client';

import { IPurchasesRepository } from './repository/interfaces/purchases.repository.interface';
import { IPurchaseService } from './service/interfaces/purchases.service.interface';
import { PurchasesRepository } from './repository/purchases.repository';
import { PurchasesController } from './controller/purchases.controller';
import { IPurchasesController } from './controller/interfaces';
import { PurchaseService } from './service/purchases.service';
import { UniversalConverter } from '../../common/converter';
import { PurchaseEntity } from './entities/purchase.entity';
import { PurchaseConverter } from './purchases.converter';
import { PURCHASE_MODULES } from './types';

export const purchasesBindings = new ContainerModule((bind) => {
    bind<IPurchasesRepository>(PURCHASE_MODULES.PurchasesRepository)
        .to(PurchasesRepository)
        .inSingletonScope();
    bind<UniversalConverter<PurchaseEntity, Purchases>>(PURCHASE_MODULES.PurchaseConverter)
        .to(PurchaseConverter)
        .inSingletonScope();
    bind<IPurchaseService>(PURCHASE_MODULES.PurchaseService).to(PurchaseService).inSingletonScope();
    bind<IPurchasesController>(PURCHASE_MODULES.PurchasesController)
        .to(PurchasesController)
        .inSingletonScope();
});
