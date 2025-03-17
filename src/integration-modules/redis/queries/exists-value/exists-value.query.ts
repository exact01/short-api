import { BaseQuery, Query } from '../../../../common/cqrs';

@Query('EXISTS_REDIS_VALUE')
export class ExistsRedisValueQuery extends BaseQuery {
    readonly type = 'EXISTS_REDIS_VALUE';

    constructor(public readonly key: string) {
        super();
    }
}
