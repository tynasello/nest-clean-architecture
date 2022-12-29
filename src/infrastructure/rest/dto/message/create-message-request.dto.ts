import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageRequestDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  receiverUsername: string;
}
