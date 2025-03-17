import { IQuery } from '../interfaces/query-bus.interface';

export abstract class BaseQuery implements IQuery {
    abstract readonly type: string;
}
