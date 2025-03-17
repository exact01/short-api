import { BaseCommand, Command } from '../../../../common/cqrs';

@Command('SET_REDIS_VALUE')
export class SetRedisValueCommand extends BaseCommand {
    readonly type = 'SET_REDIS_VALUE';

    constructor(
        public readonly key: string,
        public readonly value: string,
        public readonly ttlSeconds?: number,
    ) {
        super();
    }
}
