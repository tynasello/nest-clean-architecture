export class MessageDto {
  id: string;
  content: string;
  createdAt: string;
  senderUsername: string;
  receiverUsername: string;

  private constructor(props: any) {
    const { id, content, createdAt, senderUsername, receiverUsername } = props;
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.senderUsername = senderUsername;
    this.receiverUsername = receiverUsername;
  }

  public static create(props: MessageDto) {
    return new MessageDto(props);
  }
}
