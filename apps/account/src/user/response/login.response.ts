import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class UserAndToken {
  @Field(() => User)
  user: User;

  @Field(() => String)
  access_token: string;
}
