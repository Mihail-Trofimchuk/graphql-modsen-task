import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';

import { DbModule } from '@app/db';
import { RolesGuard } from '@app/auth/Guards/roles.guard';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { Cart } from './entities/cart.entity';
import { User } from './entities/user.entity';
import { CartItem } from './entities/cart-item';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { CartItemResolver } from './cart-item.resolver';

@Module({
  imports: [
    DbModule,
    TypeOrmModule.forFeature([Cart, User, CartItem]),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'CART_CLIENT',
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: () => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: ['localhost:9092'],
                clientId: 'cart-service',
              },
              consumer: {
                groupId: 'cart-service-consumer',
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
  controllers: [CartController],
  providers: [
    CartResolver,
    CartService,
    CartRepository,
    CartItemResolver,
    RolesGuard,
  ],
})
export class CartModule {}
