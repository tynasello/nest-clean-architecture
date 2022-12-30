import { IsNotEmpty, IsString } from 'class-validator';

export class GetMessageHistoryWithUsernameRequestDto {
  @IsNotEmpty()
  @IsString()
  otherUsername: string;
}
