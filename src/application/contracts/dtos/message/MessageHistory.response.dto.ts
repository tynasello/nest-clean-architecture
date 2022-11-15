import { MessageDto } from './Message.dto';

export class MessageHistoryResponseDto {
  sentMessages: MessageDto[];
  receivedMessages: MessageDto[];

  private constructor(props: any) {
    const { sentMessages, receivedMessages } = props;
    this.sentMessages = sentMessages;
    this.receivedMessages = receivedMessages;
  }

  public static create(props: any): MessageHistoryResponseDto {
    return new MessageHistoryResponseDto(props);
  }
}
