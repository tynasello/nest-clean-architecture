import { Message } from 'src/domain/entities/message';

interface MessageDtoProps {
  id: string;
  content: string;
  createdAt: Date;
  senderUsername: string;
  receiverUsername: string;
}

export interface MessageDto extends MessageDtoProps {}

export class MessageDto {
  constructor(props: Message) {
    this.id = props.id;
    this.content = props.content;
    this.createdAt = props.createdAt;
    this.senderUsername = props.senderUsername;
    this.receiverUsername = props.receiverUsername;
  }
}
