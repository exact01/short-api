export const USER_MODULES = {
    UserController: Symbol.for('UserController'),
    UserConverter: Symbol.for('UserConverter'),
    UserService: Symbol.for('UserService'),
    UsersRepository: Symbol.for('UsersRepository'),
} as const;
