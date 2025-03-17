export class HTTPError extends Error {
    statusCode: number;
    context?: string;
    timestamp: string;
    route?: string;

    constructor(statusCode: number, message: string, context?: string, route?: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.context = context;
        this.route = route;
        this.timestamp = new Date().toISOString();
    }
}
