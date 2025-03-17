import { BaseCommand, Command } from '../../../../common/cqrs';

@Command('CREATE_USER')
export class CreateUserCommand extends BaseCommand {
    readonly type = 'CREATE_USER';

    constructor(
        public readonly email: string,
        public readonly password: string,
    ) {
        super();
    }
}
