import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Product } from '../../../apps/catalog/src/product/entities/product.entity';
import { Category } from '../../../apps/catalog/src/product/entities/category.entity';
import { User } from '../../../apps/account/src/user/entities/user.entity';
import { Cart } from 'apps/cart/src/cart/entities/cart.entity';
import { CartItem } from 'apps/cart/src/cart/entities/cart-item';
import { Order } from 'apps/order/src/order/entities/order.entity';
// import { Cart } from 'apps/cart/src/cart/entities/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_SERVER_HOST'),
        port: Number(configService.get('DB_SERVER_PORT')),
        username: configService.get('DB_SERVER_USERNAME'),
        password: configService.get('DB_SERVER_PASSWORD'),
        database: configService.get('DATABASE'),
        entities: [Product, Category, User, Cart, CartItem, Order],
        synchronize: true,
        logging: true,
      }),
    }),
  ],
  providers: [],
  exports: [],
})
export class DbModule {}

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       ...defaultOptions,
//       name: 'userConnection',
//       type: 'postgres',
//       host: 'user_db_host',
//       entities: [User],
//     }),
//     TypeOrmModule.forRoot({
//       ...defaultOptions,
//       type: 'postgres',
//       name: 'catalogConnection',
//       host: 'catalog_db_host',
//       entities: [Category, Product],
//     }),
//   ],
// })
// export class DbModule {}

//synchronize: !(process.env.NODE_ENV.trim() === 'production'),

// TypeOrmModule.forRoot({
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   password: 'root',
//   username: 'root',
//   entities: [Product, Category],
//   database: 'product_db',
//   synchronize: true,
//   logging: true,
// }),
