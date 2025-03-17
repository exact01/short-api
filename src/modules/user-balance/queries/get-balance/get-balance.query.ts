import { BaseQuery, Query } from '../../../../common/cqrs';

@Query('GET_BALANCE')
export class GetBalanceQuery extends BaseQuery {
    readonly type = 'GET_BALANCE';

    constructor(public readonly userUuid: string) {
        super();
    }
}
