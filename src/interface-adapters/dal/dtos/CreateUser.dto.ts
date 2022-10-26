import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  profile_color: string;
}
