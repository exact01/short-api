import { BaseQuery, Query } from '../../../../common/cqrs';

@Query('GET_REDIS_VALUE')
export class GetRedisValueQuery extends BaseQuery {
    readonly type = 'GET_REDIS_VALUE';

    constructor(public readonly key: string) {
        super();
    }
}
