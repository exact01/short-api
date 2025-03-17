import { BaseCommand, Command } from '../../../../common/cqrs';

@Command('INCREMENT_BALANCE')
export class IncrementBalanceCommand extends BaseCommand {
    readonly type = 'INCREMENT_BALANCE';

    constructor(
        public readonly userUuid: string,
        public readonly amount: number,
    ) {
        super();
    }
}
