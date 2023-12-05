import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';

import { Order } from './entities/order.entity';
import { Product } from 'apps/catalog/src/product/entities/product.entity';
import { Cart } from 'apps/cart/src/cart/entities/cart.entity';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly connection: Connection,
  ) {}

  public async createOrder(
    user_id: number,
    shippingAddress: string,
  ): Promise<Order> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userCart = await this.cartRepository.findOne({
        where: { user: { user_id } },
        relations: ['user', 'items', 'items.cartProduct'],
      });

      const total = userCart.total_price;

      for (const cartItem of userCart.items) {
        const product = cartItem.cartProduct;
        if (product.available_quantity < cartItem.cartItem_quantity) {
          throw new NotFoundException(`Insufficient quantity for product`);
        }
      }

      console.log(userCart.user);
      console.log(userCart);
      const newOrder = this.orderRepository.create({
        user: userCart.user,
        cart: userCart,
        shippingAddress: shippingAddress,
        total,
      });

      for (const cartItem of userCart.items) {
        const product = cartItem.cartProduct;
        product.available_quantity -= cartItem.cartItem_quantity;
        await queryRunner.manager.save(Product, product);
      }

      await queryRunner.manager.save(Cart, userCart);
      await queryRunner.manager.save(Order, newOrder);

      await queryRunner.commitTransaction();

      const order_id = newOrder.id;
      const orderResult = this.orderRepository.findOne({
        where: { id: order_id },
        relations: ['user', 'cart'],
      });

      return orderResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
