export interface IConfigService {
    get: (key: string) => string;
    getOrThrow: (key: string) => string;
}
