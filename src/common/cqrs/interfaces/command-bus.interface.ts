import { CommandMetadata, CommandResult } from '../types/command.types';

export interface ICommand {
    readonly type: string;
}

export interface ICommandBus {
    execute<TCommand extends ICommand, TResult = void>(
        command: TCommand,
    ): Promise<CommandResult<TResult>>;

    register<TCommand extends ICommand, TResult = void>(
        handler: ICommandHandler<TCommand, TResult>,
    ): void;
}

export interface ICommandHandler<TCommand extends ICommand, TResult = void> {
    execute(command: TCommand, metadata?: CommandMetadata): Promise<TResult>;
}
