import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  profileColor?: string;
}
