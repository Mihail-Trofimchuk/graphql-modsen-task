import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateCategoryProductInput } from '../product/create-category-product.input';

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => [CreateCategoryProductInput], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryProductInput)
  products?: CreateCategoryProductInput[];
}
