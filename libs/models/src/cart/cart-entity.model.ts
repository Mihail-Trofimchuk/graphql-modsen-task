import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user-entity.model';
import { CartItem } from './cart-item-entity.model';

@Entity({ name: 'cart_table' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  total_quantity?: number;

  @Column({ nullable: true })
  total_price?: number;

  @Column()
  @CreateDateColumn()
  created_at: string;

  @Column({ nullable: true })
  updated_at?: string;

  //@OneToOne(() => User, (user) => user.cart)
  // @JoinColumn({ name: 'id' })

  @OneToOne(() => User, (user) => user.user_id)
  @JoinColumn()
  user: User;

  @ManyToMany(() => CartItem, { cascade: true })
  @JoinTable({ name: 'cartItem_id' })
  items?: CartItem[];
}
