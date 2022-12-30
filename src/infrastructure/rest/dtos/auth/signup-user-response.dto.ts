type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

interface SignupUserResponseDtoProps {
  accessToken: string;
  refreshToken: string;
}

export interface SignupUserResponseDto extends SignupUserResponseDtoProps {}

export class SignupUserResponseDto {
  constructor(props: AuthTokens) {
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
  }
}
