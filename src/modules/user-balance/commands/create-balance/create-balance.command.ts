import { BaseCommand, Command } from '../../../../common/cqrs';

@Command('CREATE_BALANCE')
export class CreateBalanceCommand extends BaseCommand {
    readonly type = 'CREATE_BALANCE';

    constructor(
        public readonly userUuid: string,
        public readonly initialBalance: number,
    ) {
        super();
    }
}
