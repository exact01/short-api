import { IQuery } from '../interfaces/query-bus.interface';

export type QueryMetadata = {
    correlationId?: string;
    timestamp: Date;
    type: string;
};
export type QueryResult<T> = T extends Promise<infer R> ? R : T;
export type QueryType<T> = T extends IQuery ? T['type'] : never;
