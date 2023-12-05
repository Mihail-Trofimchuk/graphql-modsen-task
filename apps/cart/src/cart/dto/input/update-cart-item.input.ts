import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateCartItemInput {
  @Field()
  cart_id: number;

  @Field()
  cartItem_id: number;

  @Field()
  cartItem_quantity: number;
}
