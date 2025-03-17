import { ICommand } from '../interfaces/command-bus.interface';

export type CommandMetadata = {
    correlationId?: string;
    timestamp: Date;
    type: string;
};
export type CommandResult<T> = T extends Promise<infer R> ? R : T;
export type CommandType<T> = T extends ICommand ? T['type'] : never;
