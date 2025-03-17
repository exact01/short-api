import { BaseCommand, Command } from '../../../../common/cqrs';

@Command('DECREMENT_BALANCE')
export class DecrementBalanceCommand extends BaseCommand {
    readonly type = 'DECREMENT_BALANCE';

    constructor(
        public readonly userUuid: string,
        public readonly amount: number,
    ) {
        super();
    }
}
