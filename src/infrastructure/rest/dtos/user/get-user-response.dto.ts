import { User } from 'src/domain/entities/user';

interface GetUserResponseDtoProps {
  id: string;
  username: string;
}

export interface GetUserResponseDto extends GetUserResponseDtoProps {}

export class GetUserResponseDto {
  constructor(props: User) {
    this.id = props.id;
    this.username = props.username;
  }
}
