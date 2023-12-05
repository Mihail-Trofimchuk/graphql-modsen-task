import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { CartItem } from 'apps/cart/src/cart/entities/cart-item';

@Entity({ name: 'product_table' })
// @Directive('@key(fields: "id")')
// @Directive('@shareable')
// @ObjectType('Product')
export class Product {
  @PrimaryGeneratedColumn()
  // @Field(() => ID)
  id: number;

  @Column()
  // @Field(() => String)
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 255, select: true })
  // @Field({ nullable: true })
  description?: string;

  @Column({ type: 'real', select: true })
  // @Field(() => Float)
  price: number;

  @ManyToOne(() => Category, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  // @Field(() => Category)
  category: Category;

  @Column()
  category_id: number;

  @Column()
  // @Field()
  image: string;

  @CreateDateColumn({ type: 'timestamptz' })
  // @Field(() => String)
  created_at: string;

  @Column({ type: 'timestamptz', nullable: true })
  // @Field(() => String)
  updated_at?: string;

  @Column()
  // @Field(() => Int)
  available_quantity: number;

  @OneToMany(() => CartItem, (CartItem) => CartItem.cartProduct)
  cartItem?: CartItem[];
}
