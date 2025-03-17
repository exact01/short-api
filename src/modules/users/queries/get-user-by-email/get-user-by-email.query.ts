import { BaseQuery, Query } from '../../../../common/cqrs';

@Query('GET_USER_BY_EMAIL')
export class GetUserByEmailQuery extends BaseQuery {
    readonly type = 'GET_USER_BY_EMAIL';

    constructor(public readonly email: string) {
        super();
    }
}
