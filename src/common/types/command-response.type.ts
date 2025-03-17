export interface ICommandResponse<T> {
    code?: string;
    data?: T;
    isSuccess: boolean;
    message?: string;
}
