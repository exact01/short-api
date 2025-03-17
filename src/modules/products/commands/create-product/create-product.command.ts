import { BaseCommand, Command } from '../../../../common/cqrs';

@Command('CREATE_PRODUCT')
export class CreateProductCommand extends BaseCommand {
    readonly type = 'CREATE_PRODUCT';

    constructor(
        public readonly marketHashName: string,
        public readonly currency: string,
        public readonly suggestedPrice: number,
        public readonly itemPage: string,
        public readonly marketPage: string,
        public readonly minPrice: number,
        public readonly maxPrice: number,
        public readonly meanPrice: number,
        public readonly medianPrice: number,
        public readonly quantity: number,
    ) {
        super();
    }
}
