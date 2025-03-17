import { ICommand } from '../interfaces/command-bus.interface';

export abstract class BaseCommand implements ICommand {
    abstract readonly type: string;
}
