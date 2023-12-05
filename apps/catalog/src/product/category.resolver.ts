import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveReference,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { Category } from './entities/category.entity';
import { ProductService } from './product.service';
import { DeleteCategoryInput } from './dto/input/category/delete-category.input';
import { CreateCategoryInput } from './dto/input/category/create-category.input';
import { Product } from './entities/product.entity';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Category], { name: 'allCategories' })
  async categories(): Promise<Category[]> {
    return this.productService.findAllCategories();
  }

  @Query(() => Category, { name: 'getCategory' })
  async getCategory(@Args('id') id: number): Promise<Category> {
    return this.productService.findCategoryById(id);
  }

  @Mutation(() => Category, { name: 'createCategory' })
  async createCategory(
    @Args('input') input: CreateCategoryInput,
  ): Promise<Category> {
    const { products, ...categoryData } = input;
    const createdCategory =
      await this.productService.createCategoryWithProducts(
        categoryData,
        products,
      );

    return createdCategory;
  }

  @Mutation(() => Category)
  async deleteCategory(
    @Args('DeleteCategoryInput') deleteCategoryInput: DeleteCategoryInput,
  ): Promise<Category> {
    return await this.productService.deleteCategory(
      deleteCategoryInput.category_id,
    );
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; category_id: number }) {
    return this.productService.findCategoryById(reference.category_id);
  }

  @ResolveField('products')
  async products(@Parent() category: Category): Promise<Product[]> {
    const { category_id } = category;
    return this.productService.getProductsByCategory(category_id);
  }
}
