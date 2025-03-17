import { ContainerModule } from 'inversify';

import { IExeptionFilter } from './common/errors/interfaces/exeption.filter.interface';
import { IConfigService } from './common/config/interfaces/config.service.interface';
import { CommandBus, ICommandBus, IQueryBus, QueryBus } from './common/cqrs';
import { ILogger } from './common/logger/interfaces/logger.interface';
import { ExeptionFilter } from './common/errors/exeption.filter';
import { PrismaService } from './common/database/prisma.service';
import { ConfigService } from './common/config/config.service';
import { LoggerService } from './common/logger/logger.service';
import { TYPES } from './types';
import { App } from './app';

export const appBindings = new ContainerModule((bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
    bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
    bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
    bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
    bind<ICommandBus>(TYPES.CommandBus).to(CommandBus).inSingletonScope();
    bind<IQueryBus>(TYPES.QueryBus).to(QueryBus).inSingletonScope();
    bind<App>(TYPES.Application).to(App);
});
