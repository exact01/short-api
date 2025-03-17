import { BaseCommand, Command } from '../../../../common/cqrs';

@Command('DELETE_REDIS_VALUE')
export class DeleteRedisValueCommand extends BaseCommand {
    readonly type = 'DELETE_REDIS_VALUE';

    constructor(public readonly key: string) {
        super();
    }
}
