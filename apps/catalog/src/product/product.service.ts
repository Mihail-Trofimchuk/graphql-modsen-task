import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { WinstonService } from '@app/winston/winston.service';
import { CreateProductInput } from './dto/input/product/create-product.input';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import { CreateCategoryInput } from './dto/input/category/create-category.input';
import { Category } from './entities/category.entity';
import { GetProductArgs } from './dto/args/get-product.args';
import { UpdateProductInput } from './dto/input/product/update-product.input';
import { ERROR_MESSAGES, PRODUCT_SERVICE } from './constants/catalog.constants';
import { CreateCategoryProductInput } from './dto/input/product/create-category-product.input';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly logger: WinstonService,
  ) {}

  private async checkExistingProduct(id: number): Promise<Product> {
    const existingProduct = await this.productRepository.getProductById(id);
    if (!existingProduct) {
      this.logger.warn(
        `Product with such ID ${id} not found.`,
        PRODUCT_SERVICE,
      );
      throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }
    return existingProduct;
  }

  private async checkExistingCategory(id: number): Promise<Category> {
    const existingCategory = await this.productRepository.findCategoryById(id);
    if (!existingCategory) {
      this.logger.warn(
        `Category with such ID ${id} not found.`,
        PRODUCT_SERVICE,
      );
      throw new NotFoundException(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }
    return existingCategory;
  }

  public async createProduct(
    createProductInput: CreateProductInput,
  ): Promise<Product> {
    if (createProductInput.available_quantity < 0) {
      throw new BadRequestException(ERROR_MESSAGES.AVAILABLE_QUANTITY);
    }
    const product = await this.productRepository.create(createProductInput);

    this.logger.log(`Created prodict with ID ${product.id}`, PRODUCT_SERVICE);
    return product;
  }

  public async createCategory(name: string): Promise<Category> {
    const category = await this.productRepository.createCategory(name);

    this.logger.log(
      `Created category with ID ${category.category_id}`,
      PRODUCT_SERVICE,
    );
    return category;
  }

  public async findCategoryById(id: number): Promise<Category> {
    this.logger.log(`Search category by ID`, PRODUCT_SERVICE);
    return await this.productRepository.findCategoryById(id);
  }

  public async findAllCategories(): Promise<Category[]> {
    this.logger.log(`Search all categories`, PRODUCT_SERVICE);
    return await this.productRepository.findAllCategories();
  }

  public async getProductsByCategory(category_id: number): Promise<Product[]> {
    this.logger.log(`Search product by Category`, PRODUCT_SERVICE);
    return await this.productRepository.getProductsByCategory(category_id);
  }

  public async getProductsById(product_id: number): Promise<Product> {
    this.logger.log(`Search product by if`, PRODUCT_SERVICE);
    return await this.productRepository.getProductsById(product_id);
  }

  public async getProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async createCategoryWithProducts(
    categoryData: CreateCategoryInput,
    products: CreateCategoryProductInput[],
  ): Promise<Category> {
    const createdCategory = await this.productRepository.createCategory(
      categoryData.name,
    );

    if (products && products.length > 0) {
      for (const product of products) {
        product.category_id = createdCategory.category_id;
        await this.createProduct(product);
      }
    }

    this.logger.log(
      `Created category with ID ${createdCategory.category_id}`,
      PRODUCT_SERVICE,
    );
    return createdCategory;
  }

  public async getProductByName(
    getProductArgs: GetProductArgs,
  ): Promise<Product> {
    return await this.productRepository.getProductByName(getProductArgs.name);
  }

  public async updateProduct(
    updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    const { id, category_id } = updateProductInput;

    await this.checkExistingProduct(id);

    await this.checkExistingCategory(category_id);

    if (category_id) {
      await this.productRepository.updateProductCategory(id, category_id);
    }
    return this.productRepository.updateProduct(updateProductInput);
  }

  public async deleteProduct(id: number) {
    const existingProduct = await this.checkExistingProduct(id);
    this.logger.log(
      `Product with ID ${existingProduct.id} deleted.`,
      PRODUCT_SERVICE,
    );
    this.productRepository.deleteProduct(existingProduct.id);
    return existingProduct;
  }

  public async deleteCategory(id: number) {
    const existingCategoty = await this.checkExistingCategory(id);

    this.logger.log(
      `Category with ID ${existingCategoty.category_id} deleted.`,
      PRODUCT_SERVICE,
    );
    this.productRepository.deleteCategory(existingCategoty.category_id);
    return existingCategoty;
  }
}
