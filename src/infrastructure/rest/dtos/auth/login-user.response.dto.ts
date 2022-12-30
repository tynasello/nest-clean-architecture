type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

interface LoginUserResponseDtoProps {
  accessToken: string;
  refreshToken: string;
}

export interface LoginUserResponseDto extends LoginUserResponseDtoProps {}

export class LoginUserResponseDto {
  constructor(props: AuthTokens) {
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
  }
}
