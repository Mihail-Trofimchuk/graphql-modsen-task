import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class DeleteCategoryInput {
  @Field()
  @IsNotEmpty()
  category_id: number;
}
