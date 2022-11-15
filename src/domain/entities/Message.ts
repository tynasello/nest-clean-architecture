import { Result } from '@application/logic/Result';
import { User } from '@domain/entities/User';
import { AggregateRoot } from '@domain/primitives/AggregateRoot';
import { Id } from '@domain/value-objects/Id';
import { MessageContent } from '@domain/value-objects/message/MessageContent';

type MessageProps = {
  id: Id;
  content: MessageContent;
  createdAt: Date;
  sender: User;
  receiver: User;
};

export class Message extends AggregateRoot<MessageProps> {
  private constructor(props: MessageProps) {
    super(props);
  }

  public static create(props: Partial<MessageProps>): Result<Message> {
    const { id, content, createdAt, sender, receiver } = props;

    const user = new Message({
      id,
      content,
      createdAt,
      sender,
      receiver,
    });

    return Result.ok<Message>(user);
  }
}
