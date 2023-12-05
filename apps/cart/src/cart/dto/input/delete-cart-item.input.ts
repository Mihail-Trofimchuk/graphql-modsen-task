import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DeleteCartItemInput {
  @Field()
  cart_id: number;

  @Field()
  cartItem_id: number;
}
