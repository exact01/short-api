export interface ILogger {
    error: (...args: unknown[]) => void;
    log: (...args: unknown[]) => void;
    logger: unknown;
    warn: (...args: unknown[]) => void;
}
