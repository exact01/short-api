import { injectable } from 'inversify';
import 'reflect-metadata';

import { ICommand, ICommandHandler } from '../interfaces/command-bus.interface';
import { CommandType } from '../types/command.types';
import { CQRS_METADATA } from '../constants';

export function CommandHandler<T extends ICommand>(command: new (...args: any[]) => T) {
    return function <TConstructor extends { new (...args: any[]): ICommandHandler<T, any> }>(
        constructor: TConstructor,
    ): TConstructor {
        const commandInstance = new command();

        Reflect.defineMetadata(
            CQRS_METADATA.COMMAND_TYPE,
            commandInstance.type as CommandType<T>,
            constructor,
        );
        Reflect.defineMetadata(CQRS_METADATA.COMMAND_HANDLER, true, constructor);

        return injectable()(constructor) as TConstructor;
    };
}
