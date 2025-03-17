export const TYPES = {
    Application: Symbol.for('Application'),
    ILogger: Symbol.for('ILogger'),
    ExeptionFilter: Symbol.for('ExeptionFilter'),
    ConfigService: Symbol.for('ConfigService'),
    PrismaService: Symbol.for('PrismaService'),
    CommandBus: Symbol.for('CommandBus'),
    QueryBus: Symbol.for('QueryBus'),
} as const;
