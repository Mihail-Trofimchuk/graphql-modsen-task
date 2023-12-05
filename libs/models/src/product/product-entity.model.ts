import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItem } from '../cart/cart-item-entity.model';
import { Category } from './category-entity.model';

@Entity({ name: 'product_table' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 255, select: true })
  description?: string;

  @Column({ type: 'real', select: true })
  price: number;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  image: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    select: true,
  })
  created_at: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    select: true,
  })
  updated_at: string;

  @Column()
  available_quantity: number;

  @OneToMany(() => CartItem, (CartItem) => CartItem.cartProduct)
  cartItem?: CartItem[];
}
