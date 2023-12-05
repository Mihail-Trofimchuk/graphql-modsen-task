import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductModule } from './../src/product/product.module';
import { Product } from '../src/product/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../src/product/entities/category.entity';
import { ProductRepository } from '../src/product/product.repository';
import { DbModule } from '../../../libs/db/src/db.module';

describe('CatalogController (e2e)', () => {
  let app: INestApplication;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        DbModule,
        TypeOrmModule.forFeature([Product, Category]),
        ProductModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    productRepository = moduleFixture.get<ProductRepository>(ProductRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/graphql (POST)', async () => {
    const createProductInput = {
      name: 'Test Product',
      description: 'Test Description',
      price: 222.99,
      category_id: 36,
      image: 'test-image.jpg',
      created_at: '2023-11-15T12:00:00Z',
      updated_at: '2023-11-15T12:00:00Z',
      available_quantity: 10,
    };

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation CreateProduct {
            createProduct(CreateProductInput: {
              name: "${createProductInput.name}",
              description: "${createProductInput.description}",
              price: ${createProductInput.price},
              category_id: ${createProductInput.category_id},
              image: "${createProductInput.image}",
              created_at: "${createProductInput.created_at}",
              updated_at: "${createProductInput.updated_at}",
              available_quantity: ${createProductInput.available_quantity},
            },) {
              id
              name
              description
              price
              category {
                category_id
              }
              image
              created_at
              updated_at
              available_quantity
            }
          }
        `,
      })
      .expect(200);

    const createdProduct = response.body.data.createProduct;

    expect(createdProduct).toBeDefined();
    expect(createdProduct.name).toBe(createProductInput.name);

    await productRepository.deleteProduct(createdProduct.id);
  });
});
