import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

import { Cart } from './cart.entity';
// import { Cart } from './cart.entity';

@ObjectType()
@Directive('@key(fields: "user_id")')
export class User {
  @Field(() => ID)
  user_id: number;

  @Field(() => Cart, { nullable: true })
  cart?: Cart;
}
