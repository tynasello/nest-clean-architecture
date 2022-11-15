import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignupUserRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  profileColor?: string;
}
