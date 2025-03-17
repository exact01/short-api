import { QueryMetadata, QueryResult } from '../types/query.types';

export interface IQuery {
    readonly type: string;
}

export interface IQueryBus {
    execute<TQuery extends IQuery, TResult>(query: TQuery): Promise<QueryResult<TResult>>;

    register<TQuery extends IQuery, TResult>(handler: IQueryHandler<TQuery, TResult>): void;
}

export interface IQueryHandler<TQuery extends IQuery, TResult> {
    execute(query: TQuery, metadata?: QueryMetadata): Promise<TResult>;
}
