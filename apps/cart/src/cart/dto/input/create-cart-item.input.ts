import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCartItemInput {
  @Field()
  cart_id: number;

  @Field()
  product_id: number;

  @Field()
  quantity: number;
}
