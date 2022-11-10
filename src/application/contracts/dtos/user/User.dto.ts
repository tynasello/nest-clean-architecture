export class UserDto {
  id: string;
  username: string;
  password: string;
  refreshToken: string;
  profileColor: string;

  private constructor(props: any) {
    const { id, username, password, refreshToken, profileColor } = props;
    this.id = id;
    this.username = username;
    this.password = password;
    this.refreshToken = refreshToken;
    this.profileColor = profileColor;
  }

  public static create(props: any) {
    return new UserDto(props);
  }
}
