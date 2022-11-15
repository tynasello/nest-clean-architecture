import { IsNotEmpty, IsString } from 'class-validator';

export class MessageHistoryWithContactRequestDto {
  @IsNotEmpty()
  @IsString()
  contactUsername: string;
}
