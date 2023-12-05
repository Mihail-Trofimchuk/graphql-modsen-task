import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from '../cart/cart-entity.model';

@Entity({ name: 'user_table' })
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  email: string;

  @Column()
  displayName: string;

  cart?: Cart;

  @Column()
  passwordHash: string;
}
