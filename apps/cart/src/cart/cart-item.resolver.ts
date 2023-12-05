import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CartService } from './cart.service';
import { CartItem } from './entities/cart-item';
import { CreateCartItemInput } from './dto/input/create-cart-item.input';
import { DeleteCartItemInput } from './dto/input/delete-cart-item.input';
import { UpdateCartItemInput } from './dto/input/update-cart-item.input';

@Resolver(() => CartItem)
export class CartItemResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(() => CartItem)
  createCartItem(
    @Args('createCartItemInput') createCartItemInput: CreateCartItemInput,
  ) {
    return this.cartService.create(createCartItemInput);
  }

  @Mutation(() => CartItem)
  deleteCartItem(
    @Args('deleteCartItemInput') deleteCartItemInput: DeleteCartItemInput,
  ) {
    return this.cartService.delete(deleteCartItemInput);
  }

  @Mutation(() => CartItem)
  updateCartItem(
    @Args('updateCartItemInput') updateCartItemInput: UpdateCartItemInput,
  ) {
    return this.cartService.update(updateCartItemInput);
  }
}
