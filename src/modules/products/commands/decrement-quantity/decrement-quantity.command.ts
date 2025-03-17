import { BaseCommand, Command } from '../../../../common/cqrs';

@Command('DECREMENT_QUANTITY')
export class DecrementQuantityCommand extends BaseCommand {
    readonly type = 'DECREMENT_QUANTITY';

    constructor(
        public readonly uuid: string,
        public readonly decrement: number,
    ) {
        super();
    }
}
