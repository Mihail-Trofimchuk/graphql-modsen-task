import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { format } from 'date-fns';

import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/input/product/create-product.input';
import { Category } from './entities/category.entity';
import { UpdateProductInput } from './dto/input/product/update-product.input';
import { ERROR_MESSAGES } from './constants/catalog.constants';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categotyRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Product[]> {
    const prod = await this.productRepository.find({ relations: ['category'] });
    return prod;
  }

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const { category_id, ...productData } = createProductInput;

    const categoryById = await this.categotyRepository.findOneBy({
      category_id,
    });

    if (!categoryById) {
      throw new NotFoundException(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }

    const category = new Category();
    category.category_id = category_id;
    category.category_name = categoryById.category_name;

    const product = this.productRepository.create({
      ...productData,
      category: category,
    });

    await this.productRepository.save(product);
    product.created_at = format(
      new Date(product.created_at),
      "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
    );
    return product;
  }

  async createCategory(category_name: string) {
    try {
      const category = this.categotyRepository.create({ category_name });
      await this.categotyRepository.save(category);
      return category;
    } catch {
      throw new ConflictException(ERROR_MESSAGES.CATEGOTY_ALREADY_EXISTS);
    }
  }

  async findAllCategories() {
    return this.categotyRepository.find({ relations: ['products'] });
  }

  async findCategoryById(category_id: number) {
    return this.categotyRepository.findOneBy({ category_id });
  }

  async findCategoryByName(category_name: string) {
    return this.categotyRepository.findOneBy({ category_name });
  }

  async getProductsByCategory(category_id: number) {
    return await this.productRepository.find({
      where: { category: { category_id: category_id } },
    });
  }

  async getProductsById(id: number) {
    return await this.productRepository.findOne({
      where: { id: id },
    });
  }

  async getProductByName(name: string) {
    return await this.productRepository.findOne({
      where: { name: name },
      relations: ['category'],
    });
  }

  async getProductById(id: number) {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: ['category'],
    });
    console.log(product);
    return product;
  }

  async updateProduct(
    updateProductInput: UpdateProductInput,
  ): Promise<Product | null> {
    const { id, category_id, ...updateData } = updateProductInput;

    const category = new Category();
    category.category_id = category_id;
    updateData.updated_at = String(
      new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
    );
    await this.productRepository.update(id, updateData);

    const updatedProduct = await this.productRepository.findOne({
      where: { id: id },
      relations: ['category'],
    });

    return updatedProduct || null;
  }

  async updateProductCategory(
    product_id: number,
    category_id: number,
  ): Promise<void> {
    await this.productRepository
      .createQueryBuilder()
      .relation(Product, 'category')
      .of(product_id)
      .set(category_id);
  }

  async deleteProduct(id: number) {
    await this.productRepository.delete(id);
  }

  async deleteCategory(id: number) {
    await this.categotyRepository.delete(id);
  }
}
