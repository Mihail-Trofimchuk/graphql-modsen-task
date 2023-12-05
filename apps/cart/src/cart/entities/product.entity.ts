import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

import { CartItem } from './cart-item';

@ObjectType()
@Directive('@extends')
@Directive('@shareable')
@Directive('@key(fields: "id")')
export class Product {
  @Field(() => ID)
  id: string;

  @Field(() => [CartItem], { nullable: true })
  cartItem?: CartItem[];
}
