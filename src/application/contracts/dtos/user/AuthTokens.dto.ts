export class AuthTokensDto {
  accessToken: string;

  refreshToken?: string;

  private constructor(props: any) {
    const { accessToken, refreshToken } = props;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public static create(props: any): AuthTokensDto {
    const { accessToken, refreshToken } = props;

    const authTokensDto = new AuthTokensDto({
      accessToken,
      refreshToken,
    });
    return authTokensDto;
  }
}