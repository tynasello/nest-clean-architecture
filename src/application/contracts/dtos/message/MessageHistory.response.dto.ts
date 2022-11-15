import { MessageResponseDto } from './Message.response.dto';

export class MessageHistoryResponseDto {
  sentMessages: MessageResponseDto[];
  receivedMessages: MessageResponseDto[];

  private constructor(props: any) {
    const { sentMessages, receivedMessages } = props;
    this.sentMessages = sentMessages;
    this.receivedMessages = receivedMessages;
  }

  public static create(props: any): MessageHistoryResponseDto {
    return new MessageHistoryResponseDto(props);
  }
}
