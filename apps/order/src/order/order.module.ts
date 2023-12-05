import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderRepository } from './order.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbModule } from '@app/db';
import { Order } from './entities/order.entity';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { OrderController } from './order.controller';
import { Cart } from 'apps/cart/src/cart/entities/cart.entity';
import { Product } from 'apps/catalog/src/product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Cart, Product]),
    DbModule,
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'ORDER_CLIENT',
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: () => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: ['localhost:9092'],
                clientId: 'order-service',
              },
              consumer: {
                groupId: 'order-service-consumer',
              },
            },
          }),
        },
      ],
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
  ],
  controllers: [OrderController],
  providers: [OrderResolver, OrderService, OrderRepository, ConfigService],
})
export class OrderModule {}
