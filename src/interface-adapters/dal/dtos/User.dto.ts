/*
this class looks very similar to the User entity class, however additional fields can 
be added here to send to the user that we wouldn't want in the domain. We must also have
separate class for dto because we don't want logic such as graphql decorators in our domain.
*/

export class UserDto {
  id: string;

  username: string;

  password: string;

  profile_color?: string;

  private constructor(props: any) {
    const { id, username, password, profile_color } = props;
    this.id = id;
    this.username = username;
    this.password = password;
    this.profile_color = profile_color;
  }

  public static create(props: any): UserDto {
    const { id, username, password, profile_color } = props;

    const userDto = new UserDto({
      id,
      username,
      password,
      profile_color,
    });
    return userDto;
  }
}
