import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { GQLAuthGuard, JwtAuthGuard, SessionLocalAuthGuard } from '@app/auth';
import { CreateUserInput } from './dto/input/create-user.input';
import { LoginUserInput } from './dto/input/login-user.input';
import { User } from './entities/user.entity';
import { UserAndToken } from './response/login.response';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async register(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    const user = await this.userService.register(createUserInput);
    await this.userService.createCart(user);
    return user;
  }

  @Mutation(() => UserAndToken)
  @UseGuards(GQLAuthGuard, SessionLocalAuthGuard)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<UserAndToken> {
    return this.userService.login(loginUserInput);
  }

  @Query(() => User, { name: 'getUser' })
  getUser(@Args({ name: 'id' }) id: number): Promise<User> {
    return this.userService.findUserById(id);
  }

  @Query(() => [User], { name: 'user' })
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ResolveField('cart')
  async cart(@Parent() user: User) {
    const { user_id } = user;
    return this.userService.getCartByUserId(user_id);
  }
}
