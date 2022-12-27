export interface IAuthTokenService {
  signAuthToken(
    payload: { [key: string]: any; sub: string },
    secret: string,
    expiresIn: number,
  ): Promise<string>;

  verifyAuthToken(token: string): Promise<boolean>;

  decodeAuthToken(jwt: string): any;
}
