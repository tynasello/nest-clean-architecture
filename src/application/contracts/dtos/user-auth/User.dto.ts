/*
this class looks very similar to the User entity class, however additional fields can 
be added here to send to the user that we wouldn't want in the domain. We must also have
separate class for dto because we don't want logic such as graphql decorators in our domain.
*/

export class UserDto {
  id: string;

  username: string;

  password: string;

  refreshToken?: string;

  profileColor?: string;

  private constructor(props: any) {
    const { id, username, password, refreshToken, profileColor } = props;
    this.id = id;
    this.username = username;
    this.password = password;
    this.refreshToken = refreshToken;
    this.profileColor = profileColor;
  }

  public static create(props: any): UserDto {
    const { id, username, password, refreshToken, profileColor } = props;

    const userDto = new UserDto({
      id,
      username,
      password,
      refreshToken,
      profileColor,
    });
    return userDto;
  }
}
