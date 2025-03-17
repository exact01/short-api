export class AuthResponseModel {
    public readonly jwt: string;
    constructor(data: AuthResponseModel) {
        this.jwt = data.jwt;
    }
}
