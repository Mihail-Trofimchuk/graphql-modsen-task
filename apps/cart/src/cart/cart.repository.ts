import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Cart } from './entities/cart.entity';
import { User } from 'apps/account/src/user/entities/user.entity';
import { Product } from 'apps/catalog/src/product/entities/product.entity';
import { CartItem } from './entities/cart-item';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async createCart(user: User): Promise<Cart> {
    const newCart = this.cartRepository.create();
    newCart.user = user;
    const savedCart = await this.cartRepository.save(newCart);

    return savedCart;
  }

  async findCartById(id: number) {
    const cart = await this.cartRepository.findOne({
      where: { id: id },
      relations: ['items', 'items.cartProduct', 'items.cartProduct.category'],
    });

    return cart;
  }

  async findCartWithItems(id: number) {
    return await this.cartRepository.findOne({
      where: { id: id },
      relations: ['items'],
    });
  }

  async findUserCart(id: number): Promise<Cart> {
    return await this.cartRepository.findOne({
      where: { user: { user_id: id } },
    });
  }

  async deleteItem(cart, cartItem_id: number) {
    if (!cart.items || cart.items.length === 0) {
      throw new NotFoundException('Cart or cart items not found');
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.cartItem_id === cartItem_id,
    );
    const deletedItem = cart.items.splice(itemIndex, 1)[0];
    await this.cartItemRepository.delete(deletedItem.cartItem_id);

    cart.items = cart.items.filter((item) => item.cartItem_id !== cartItem_id);

    cart.total_price = cart.items.reduce(
      (total, item) => total + item.subtotal,
      0,
    );
    cart.total_quantity = cart.items.reduce(
      (total, item) => total + item.cartItem_quantity,
      0,
    );

    await this.cartRepository.save(cart);
    console.log(cart);
    return deletedItem;
  }

  async updateItem(
    cart,
    cartItem_id: number,
    cartItem_quantity: number,
  ): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { cartItem_id: cartItem_id },
      relations: ['cartProduct'],
    });

    if (!cartItem) {
      throw new NotFoundException(
        `CartItem with ID ${cartItem_id} not found in the specified cart`,
      );
    }

    cartItem.cartItem_quantity = cartItem_quantity;
    cartItem.subtotal = cartItem_quantity * cartItem.cartProduct.price;

    await this.cartItemRepository.save(cartItem);

    const updatedCartItems = cart.items.map((item) => {
      if (item.cartItem_id === cartItem_id) {
        return {
          ...item,
          cartItem_quantity: cartItem_quantity,
          subtotal: cartItem_quantity * cartItem.cartProduct.price,
        };
      }
      return item;
    });

    cart.items = updatedCartItems;

    cart.total_price = updatedCartItems.reduce(
      (total, item) => total + item.subtotal,
      0,
    );
    cart.total_quantity = updatedCartItems.reduce(
      (total, item) => total + item.cartItem_quantity,
      0,
    );

    await this.cartRepository.save(cart);

    const updatedCartItem = await this.cartItemRepository.findOne({
      where: { cartItem_id: cartItem_id },
      relations: ['cartProduct'],
    });

    if (!updatedCartItem) {
      throw new NotFoundException(`CartItem with ID ${cartItem_id} not found`);
    }

    return updatedCartItem;
  }

  async createItem(product: Product, cart, items_quantity: number) {
    const newCartItem = new CartItem();

    newCartItem.cartProduct = product;
    newCartItem.cartItem_quantity = items_quantity;
    newCartItem.subtotal = product.price * items_quantity;

    if (!cart.items) {
      cart.items = [];
    }
    cart.items.push(newCartItem);
    cart.total_price = cart.items.reduce(
      (total, item) => total + item.subtotal,
      0,
    );
    cart.total_quantity = cart.items.reduce(
      (total, item) => total + item.cartItem_quantity,
      0,
    );

    await this.cartRepository.save(cart);

    return newCartItem;
  }

  async getCartItems() {}
}
