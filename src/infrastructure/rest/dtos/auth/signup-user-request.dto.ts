import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupUserRequestDto {
  public static MinUsernameLength = 4;
  public static MinPasswordLength = 4;

  @IsNotEmpty()
  @IsString()
  @MinLength(SignupUserRequestDto.MinUsernameLength)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(SignupUserRequestDto.MinPasswordLength)
  password: string;
}
