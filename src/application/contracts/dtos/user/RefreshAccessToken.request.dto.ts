import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshAccessTokenRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
