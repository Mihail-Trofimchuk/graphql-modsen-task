import {
  Directive,
  Field,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Role from '@app/auth/Enum/role.enum';

import { Cart } from 'apps/cart/src/cart/entities/cart.entity';

registerEnumType(Role, {
  name: 'Role',
});

@Entity({ name: 'user_table' })
@ObjectType()
@Directive('@shareable')
@Directive('@key(fields: "user_id")')
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  user_id: number;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  displayName: string;

  @Field(() => Cart)
  cart?: Cart;

  @Column()
  @Field()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  @Field(() => Role)
  role: Role;

  @Column()
  @Field()
  stripeCustomerId: string;
}
