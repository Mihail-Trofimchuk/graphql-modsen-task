import { Args, Query, Resolver } from '@nestjs/graphql';

import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {
    console.log('CartResolver constructor called');
  }

  @Query(() => Cart, { name: 'cart' })
  findOne(@Args('id') id: number) {
    return this.cartService.findCartById(id);
  }

  @Query(() => Cart, { name: 'cart' })
  addCartItem(@Args('id') id: number) {
    return this.cartService.findCartById(id);
  }
}
