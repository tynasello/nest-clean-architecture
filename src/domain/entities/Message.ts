import { User } from './user';

interface MessageProps {
  id: string;
  content: string;
  createdAt: Date;
  sender: User;
  reciever: User;
}

export interface Message extends MessageProps {}

export class Message {
  constructor(props: MessageProps) {
    this.id = props.id;
    this.content = props.content;
    this.createdAt = props.createdAt;
    this.sender = props.sender;
    this.reciever = props.reciever;
  }
}
