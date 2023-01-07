interface MessageProps {
  id?: string;
  content: string;
  createdAt?: Date;
  senderUsername: string;
  receiverUsername: string;
}

export interface Message extends MessageProps {}

export class Message {
  constructor(props: MessageProps) {
    this.id = props.id;
    this.content = props.content;
    this.createdAt = props.createdAt;
    this.senderUsername = props.senderUsername;
    this.receiverUsername = props.receiverUsername;
  }
}
