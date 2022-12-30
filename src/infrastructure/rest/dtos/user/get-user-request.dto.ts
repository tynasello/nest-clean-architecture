import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}
