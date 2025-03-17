import { ICommandResponse } from '../types/command-response.type';
import { ERRORS } from '../../../libs/contract/constants/errors';
import { HTTPError } from '../errors/http-error.class';

export function errorHandler<T>(
    response: ICommandResponse<T>,
    context?: string,
    route?: string,
): T {
    if (response.isSuccess) {
        if (!response.data) {
            throw new HTTPError(500, 'No data returned', context, route);
        }
        return response.data;
    } else {
        if (!response.code) {
            throw new HTTPError(500, 'Unknown error', context, route);
        }
        const errorObject = Object.values(ERRORS).find((error) => error.code === response.code);

        if (!errorObject) {
            throw new HTTPError(500, 'Unknown error', context, route);
        }
        throw new HTTPError(errorObject.httpCode, errorObject.message, context, route);
    }
}
