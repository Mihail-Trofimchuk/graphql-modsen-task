import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { lastValueFrom } from 'rxjs';

import { User } from 'apps/account/src/user/entities/user.entity';
import { CartRepository } from './cart.repository';
import { Cart } from './entities/cart.entity';
import { CreateCartItemInput } from './dto/input/create-cart-item.input';
import { Product } from 'apps/catalog/src/product/entities/product.entity';
import { DeleteCartItemInput } from './dto/input/delete-cart-item.input';
import { UpdateCartItemInput } from './dto/input/update-cart-item.input';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    @Inject('CART_CLIENT') private kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('get_product');
    await this.kafkaClient.connect();
  }

  createCart(user: User): Promise<Cart> {
    return this.cartRepository.createCart(user);
  }

  async delete(deleteCartItemInput: DeleteCartItemInput) {
    const { cart_id, cartItem_id } = deleteCartItemInput;
    const cart = await this.cartRepository.findCartById(cart_id);
    return this.cartRepository.deleteItem(cart, cartItem_id);
  }

  async update(updateCartItemInput: UpdateCartItemInput) {
    const { cart_id, cartItem_id, cartItem_quantity } = updateCartItemInput;
    const cart = await this.cartRepository.findCartById(cart_id);

    return this.cartRepository.updateItem(cart, cartItem_id, cartItem_quantity);
  }

  async create(createCartItemInput: CreateCartItemInput) {
    const cart = await this.cartRepository.findCartById(
      createCartItemInput.cart_id,
    );
    console.log(cart);

    const product: Product = await lastValueFrom(
      this.kafkaClient.send('get_product', {
        id: createCartItemInput.product_id,
      }),
    );
    console.log(product);
    return this.cartRepository.createItem(
      product,
      cart,
      createCartItemInput.quantity,
    );
  }

  findCartById(id: number) {
    return this.cartRepository.findCartById(id);
  }

  findUserCart(id: number): Promise<Cart> {
    return this.cartRepository.findUserCart(id);
  }
}
