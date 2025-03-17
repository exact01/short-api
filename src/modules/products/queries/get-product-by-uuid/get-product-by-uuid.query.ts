import { BaseQuery, Query } from '../../../../common/cqrs';

@Query('GET_PRODUCT_BY_UUID')
export class GetProductByUuidQuery extends BaseQuery {
    readonly type = 'GET_PRODUCT_BY_UUID';

    constructor(public readonly uuid: string) {
        super();
    }
}
