import { BaseQuery, Query } from '../../../../common/cqrs';

@Query('GET_USER_BY_UUID')
export class GetUserByUuidQuery extends BaseQuery {
    readonly type = 'GET_USER_BY_UUID';

    constructor(public readonly uuid: string) {
        super();
    }
}
