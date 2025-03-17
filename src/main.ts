import 'reflect-metadata';
import { Container } from 'inversify';

import { integrationModules } from './integration-modules/integration.modules';
import { initializeCQRSHandlers } from './modules/cqrs.initializer';
import { productModules } from './modules/products.modules';
import { appBindings } from './app.bindings';
import { TYPES } from './types';
import { App } from './app';

export interface IBootstrapReturn {
    app: App;
    appContainer: Container;
}

export const bootstrap = async (): Promise<IBootstrapReturn> => {
    const appContainer = new Container();

    // Bind all dependencies

    appContainer.load(appBindings);
    Object.values(productModules).forEach((module) => {
        appContainer.load(module);
    });
    Object.values(integrationModules).forEach((module) => {
        appContainer.load(module);
    });

    // Initialize CQRS handlers
    initializeCQRSHandlers(appContainer);

    const app = appContainer.get<App>(TYPES.Application);
    await app.init();

    return { appContainer, app };
};

bootstrap();
