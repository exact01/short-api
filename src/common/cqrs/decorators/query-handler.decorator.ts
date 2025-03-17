import { injectable } from 'inversify';
import 'reflect-metadata';

import { IQuery, IQueryHandler } from '../interfaces/query-bus.interface';
import { QueryType } from '../types/query.types';
import { CQRS_METADATA } from '../constants';

export function QueryHandler<T extends IQuery>(query: new (...args: any[]) => T) {
    return function <TClass extends { new (...args: any[]): IQueryHandler<T, any> }>(
        constructor: TClass,
    ) {
        const queryInstance = new query();

        Reflect.defineMetadata(
            CQRS_METADATA.QUERY_TYPE,
            queryInstance.type as QueryType<T>,
            constructor,
        );
        Reflect.defineMetadata(CQRS_METADATA.QUERY_HANDLER, true, constructor);

        return injectable()(constructor);
    };
}
