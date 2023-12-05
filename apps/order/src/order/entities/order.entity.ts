import {
  ObjectType,
  Field,
  registerEnumType,
  ID,
  Float,
} from '@nestjs/graphql';
import { User } from 'apps/account/src/user/entities/user.entity';

import { Cart } from 'apps/cart/src/cart/entities/cart.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PaymentStatus {
  PAID = 'PAID',
  NOT_PAID = 'NOT_PAID',
}

enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});

@Entity({ name: 'order_table' })
@ObjectType()
export class Order {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.NOT_PAID,
  })
  @Field()
  paymentStatus: PaymentStatus;

  @ManyToOne(() => User, (user) => user.user_id)
  @JoinColumn()
  @Field(() => User)
  user: User;

  @ManyToOne(() => Cart, (Cart) => Cart.id)
  @JoinColumn()
  @Field(() => Cart)
  cart: Cart;

  @Column()
  @Field()
  shippingAddress: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PROCESSING,
  })
  @Field(() => OrderStatus)
  status: OrderStatus;

  @Column({ type: 'float' })
  @Field(() => Float)
  total?: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
