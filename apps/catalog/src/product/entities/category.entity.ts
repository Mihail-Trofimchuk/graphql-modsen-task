import { IsString } from 'class-validator';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Product } from './product.entity';

@Entity({ name: 'category_table' })
@Unique(['category_name'])
// @ObjectType('Category')
// @Directive('@key(fields: "category_id")')
// @Directive('@shareable')
export class Category {
  @PrimaryGeneratedColumn()
  // @Field(() => ID)
  category_id: number;

  @Column()
  // @Field()
  @IsString()
  category_name: string;

  @OneToMany(() => Product, (product) => product.category, {
    onDelete: 'CASCADE',
  })
  // @Field(() => [Product], { nullable: true })
  products?: Product[];
}
