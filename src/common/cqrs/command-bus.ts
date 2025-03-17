import { injectable } from 'inversify';
import 'reflect-metadata';

import { ICommand, ICommandBus, ICommandHandler } from './interfaces/command-bus.interface';
import { CommandMetadata, CommandType } from './types/command.types';
import { CQRS_METADATA } from './constants';

@injectable()
export class CommandBus implements ICommandBus {
    private handlers = new Map<string, ICommandHandler<ICommand, any>>();

    execute<TCommand extends ICommand, TResult = void>(command: TCommand): Promise<TResult> {
        const handler = this.handlers.get(command.type);
        if (!handler) {
            throw new Error(`No handler registered for command ${command.type}`);
        }

        const metadata: CommandMetadata = {
            type: command.type,
            timestamp: new Date(),
        };

        return handler.execute(command, metadata) as Promise<TResult>;
    }

    register<TCommand extends ICommand, TResult = void>(
        handler: ICommandHandler<TCommand, TResult>,
    ): void {
        const commandType = Reflect.getMetadata(
            CQRS_METADATA.COMMAND_TYPE,
            handler.constructor,
        ) as CommandType<TCommand>;

        if (!commandType) {
            throw new Error(
                `No command type metadata found for handler ${handler.constructor.name}`,
            );
        }

        if (this.handlers.has(commandType)) {
            throw new Error(`Handler for ${commandType} already registered`);
        }

        this.handlers.set(commandType, handler as ICommandHandler<ICommand, any>);
    }
}
