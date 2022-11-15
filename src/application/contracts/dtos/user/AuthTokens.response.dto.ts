export class AuthTokensResponseDto {
  accessToken: string;
  refreshToken: string;

  private constructor(props: any) {
    const { accessToken, refreshToken } = props;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public static create(props: any): AuthTokensResponseDto {
    return new AuthTokensResponseDto(props);
  }
}
