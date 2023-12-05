import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  ResolveReference,
  Resolver,
} from '@nestjs/graphql';

import { CacheControl } from 'nestjs-gql-cache-control';

import { JwtAuthGuard, RolesGuard } from '@app/auth';
import { GetProductArgs } from './dto/args/get-product.args';
import { CreateProductInput } from './dto/input/product/create-product.input';
import { DeleteProductInput } from './dto/input/product/delete-product.input';
import { UpdateProductInput } from './dto/input/product/update-product.input';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(Role.SALESMAN)
  async createProduct(
    @Args('CreateProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return await this.productService.createProduct(createProductInput);
  }

  //@UseGuards(IsAuthenticated)
  //@Roles(Role.SALESMAN, Role.USER)
  @Query(() => [Product], { name: 'getProducts', nullable: 'items' })
  @CacheControl({ maxAge: 10 })
  async getProducts(): Promise<Product[]> {
    console.log('test');
    return await this.productService.getProducts();
  }

  //@Roles(Role.SALESMAN, Role.USER)
  @Query(() => Product, { name: 'getProduct', nullable: true })
  async getProduct(@Args() getProductArgs: GetProductArgs): Promise<Product> {
    return await this.productService.getProductByName(getProductArgs);
  }

  //@Roles(Role.SALESMAN)
  @Mutation(() => Product)
  async updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return this.productService.updateProduct(updateProductInput);
  }

  //@Roles(Role.SALESMAN, Role.ADMIN)
  @Mutation(() => Product)
  async deleteProduct(
    @Args('DeleteProductInput') deleteProductInput: DeleteProductInput,
  ): Promise<Product> {
    return await this.productService.deleteProduct(deleteProductInput.id);
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: number }) {
    return this.productService.getProductsById(reference.id);
  }
}
