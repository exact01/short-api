import { ICommand } from '../interfaces/command-bus.interface';

export function Command(type: string) {
    return function <T extends { new (...args: any[]): object }>(constructor: T) {
        return class extends constructor implements ICommand {
            readonly type = type;
        };
    };
}
