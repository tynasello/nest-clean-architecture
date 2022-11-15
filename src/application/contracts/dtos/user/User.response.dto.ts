export class UserResponseDto {
  id: string;
  username: string;
  profileColor: string;

  private constructor(props: any) {
    const { id, username, profileColor } = props;
    this.id = id;
    this.username = username;
    this.profileColor = profileColor;
  }

  public static create(props: UserResponseDto) {
    return new UserResponseDto(props);
  }
}
