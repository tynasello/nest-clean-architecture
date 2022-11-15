import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
