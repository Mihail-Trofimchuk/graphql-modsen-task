import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field()
  user_id: number;

  @Field()
  shippingAddress: string;
}
