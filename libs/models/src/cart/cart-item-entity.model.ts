import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart-entity.model';
import { Product } from '../product/product-entity.model';

@Entity({ name: 'cart_item_table' })
export class CartItem {
  @PrimaryGeneratedColumn()
  cartItem_id: string;

  @ManyToOne(() => Product, (Product) => Product.cartItem)
  cartProduct: Product;

  @Column()
  cartItem_quantity: number;

  @Column()
  subtotal: number;

  cart?: Cart[];
}
