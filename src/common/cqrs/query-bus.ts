import { injectable } from 'inversify';
import 'reflect-metadata';

import { IQuery, IQueryBus, IQueryHandler } from './interfaces/query-bus.interface';
import { QueryMetadata, QueryType } from './types/query.types';
import { CQRS_METADATA } from './constants';

@injectable()
export class QueryBus implements IQueryBus {
    private handlers = new Map<string, IQueryHandler<IQuery, unknown>>();

    execute<TQuery extends IQuery, TResult>(query: TQuery): Promise<TResult> {
        const handler = this.handlers.get(query.type);
        if (!handler) {
            throw new Error(`No handler registered for query ${query.type}`);
        }

        const metadata: QueryMetadata = {
            type: query.type,
            timestamp: new Date(),
        };

        return handler.execute(query, metadata) as Promise<TResult>;
    }

    register<TQuery extends IQuery, TResult>(handler: IQueryHandler<TQuery, TResult>): void {
        const queryType = Reflect.getMetadata(
            CQRS_METADATA.QUERY_TYPE,
            handler.constructor,
        ) as QueryType<TQuery>;

        if (!queryType) {
            throw new Error(`No query type metadata found for handler ${handler.constructor.name}`);
        }

        if (this.handlers.has(queryType)) {
            throw new Error(`Handler for ${queryType} already registered`);
        }

        this.handlers.set(queryType, handler as IQueryHandler<IQuery, unknown>);
    }
}
