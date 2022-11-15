import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshAccessTokenDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
