import { BaseCommand, Command } from '../../../../common/cqrs';

@Command('INCREMENT_QUANTITY')
export class IncrementQuantityCommand extends BaseCommand {
    readonly type = 'INCREMENT_QUANTITY';

    constructor(
        public readonly uuid: string,
        public readonly increment: number,
    ) {
        super();
    }
}
