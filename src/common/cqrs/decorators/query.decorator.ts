import { IQuery } from '../interfaces/query-bus.interface';

export function Query(type: string) {
    return function <T extends { new (...args: any[]): object }>(constructor: T) {
        return class extends constructor implements IQuery {
            readonly type = type;
        };
    };
}
