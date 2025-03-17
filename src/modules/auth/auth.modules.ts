import { ContainerModule } from 'inversify';

import { AuthController } from './controller/auth.controller';
import { IAuthController } from './controller/interfaces';
import { AuthService } from './service/auth.service';
import { IAuthService } from './service/interfaces';
import { AUTH_MODULES } from './types';

export { AUTH_MODULES };

export const authBindings = new ContainerModule((bind) => {
    bind<IAuthController>(AUTH_MODULES.AuthController).to(AuthController).inSingletonScope();
    bind<IAuthService>(AUTH_MODULES.AuthService).to(AuthService).inSingletonScope();
});
