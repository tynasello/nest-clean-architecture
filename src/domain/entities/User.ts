interface UserProps {
  id?: string;
  username: string;
  password: string;
  refreshToken?: string;
}

export interface User extends UserProps {}

export class User {
  constructor(props: UserProps) {
    this.id = props.id;
    this.username = props.username;
    this.password = props.password;
    this.refreshToken = props.refreshToken;
  }
}
