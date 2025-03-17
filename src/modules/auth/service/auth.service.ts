import { inject, injectable } from 'inversify';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { CreateBalanceCommand } from '../../user-balance/commands/create-balance/create-balance.command';
import { GetUserByEmailQuery } from '../../users/queries/get-user-by-email/get-user-by-email.query';
import { IConfigService } from '../../../common/config/interfaces/config.service.interface';
import { CreateUserCommand } from '../../users/commands/create-user/create-user.command';
import { ERRORS, LoginCommand, RegisterCommand } from '../../../../libs/contract';
import { ICommandResponse } from '../../../common/types/command-response.type';
import { UserBalanceEntity } from '../../user-balance/entities';
import { ICommandBus, IQueryBus } from '../../../common/cqrs';
import { UserEntity } from '../../users/entities';
import { IAuthService } from './interfaces';
import { TYPES } from '../../../types';

@injectable()
export class AuthService implements IAuthService {
    private readonly salt: number;
    private readonly jwtSecret: string;
    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.CommandBus) private commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private queryBus: IQueryBus,
    ) {
        this.salt = Number(this.configService.getOrThrow('SALT'));
        this.jwtSecret = this.configService.getOrThrow('JWT_SECRET');
    }
    public async register(
        dto: RegisterCommand.Request,
    ): Promise<ICommandResponse<RegisterCommand.Response['data']>> {
        const { email, password } = dto;
        try {
            const existedUserResponse = await this.findUserByEmail(email);

            if (!existedUserResponse.isSuccess) {
                return {
                    isSuccess: false,
                    ...ERRORS.INTERNAL_SERVER_ERROR,
                };
            }
            if (existedUserResponse.data) {
                return {
                    isSuccess: false,
                    ...ERRORS.USER_ALREADY_EXISTS,
                };
            }

            const passwordHash = await hash(password, this.salt);
            const createUserResponse = await this.createUser(email, passwordHash);
            if (!createUserResponse.isSuccess || !createUserResponse.data) {
                return {
                    isSuccess: false,
                    ...ERRORS.INTERNAL_SERVER_ERROR,
                };
            }

            const createBalanceResponse = await this.createBalance(createUserResponse.data.uuid);
            if (!createBalanceResponse.isSuccess || !createBalanceResponse.data) {
                return {
                    isSuccess: false,
                    ...ERRORS.INTERNAL_SERVER_ERROR,
                };
            }
            const jwt = await this.signJWT(email, createUserResponse.data.uuid, this.jwtSecret);

            return {
                isSuccess: true,
                data: {
                    jwt,
                },
            };
        } catch (error) {
            return { isSuccess: false, ...ERRORS.INTERNAL_SERVER_ERROR };
        }
    }

    public async login(
        dto: LoginCommand.Request,
    ): Promise<ICommandResponse<LoginCommand.Response['data']>> {
        const { email, password } = dto;
        try {
            const existedUserResponse = await this.findUserByEmail(email);
            if (!existedUserResponse.isSuccess) {
                return {
                    isSuccess: false,
                    ...ERRORS.INTERNAL_SERVER_ERROR,
                };
            }
            if (!existedUserResponse.data) {
                return {
                    isSuccess: false,
                    ...ERRORS.USER_NOT_FOUND,
                };
            }

            const isPasswordCorrect = await compare(password, existedUserResponse.data.password);
            if (!isPasswordCorrect) {
                return {
                    isSuccess: false,
                    ...ERRORS.WRONG_PASSWORD,
                };
            }
            const jwt = await this.signJWT(email, existedUserResponse.data.uuid, this.jwtSecret);
            return {
                isSuccess: true,
                data: { jwt },
            };
        } catch (error) {
            return { isSuccess: false, ...ERRORS.INTERNAL_SERVER_ERROR };
        }
    }

    private signJWT(email: string, uuid: string, secret: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign(
                {
                    email,
                    uuid,
                    iat: Math.floor(Date.now() / 1000),
                },
                secret,
                {
                    algorithm: 'HS256',
                },
                (err, token) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(token as string);
                },
            );
        });
    }

    private async findUserByEmail(email: string): Promise<ICommandResponse<null | UserEntity>> {
        return this.queryBus.execute<GetUserByEmailQuery, ICommandResponse<null | UserEntity>>(
            new GetUserByEmailQuery(email),
        );
    }

    private async createUser(
        email: string,
        password: string,
    ): Promise<ICommandResponse<UserEntity>> {
        return this.commandBus.execute<CreateUserCommand, ICommandResponse<UserEntity>>(
            new CreateUserCommand(email, password),
        );
    }

    private async createBalance(userUuid: string): Promise<ICommandResponse<UserBalanceEntity>> {
        return this.commandBus.execute<CreateBalanceCommand, ICommandResponse<UserBalanceEntity>>(
            new CreateBalanceCommand(userUuid, 0),
        );
    }
}
