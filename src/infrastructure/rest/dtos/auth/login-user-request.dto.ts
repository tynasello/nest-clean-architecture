import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserRequestDto {
  public static MinUsernameLength = 4;
  public static MinPasswordLength = 4;

  @IsNotEmpty()
  @IsString()
  @MinLength(LoginUserRequestDto.MinUsernameLength)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(LoginUserRequestDto.MinPasswordLength)
  password: string;
}
