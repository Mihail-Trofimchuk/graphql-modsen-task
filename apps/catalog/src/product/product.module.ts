import { Module } from '@nestjs/common';
import { ApolloFederationDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ApolloServerPluginCacheControl } from 'apollo-server-core';
import responseCachePlugin from 'apollo-server-plugin-response-cache';

import { WinstonModule } from '@app/winston';
import { GraphQLExceptionFilter } from '@app/filters';

import {
  IsAuthenticated,
  JwtAuthGuard,
  JwtStrategy,
  RolesGuard,
  SessionSerializer,
} from '@app/auth';
import { DbModule } from '../../../../libs/db/src/db.module';
import { CategoryResolver } from './category.resolver';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { CatalogController } from './product.controller';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([Product, Category]),
    DbModule,
    WinstonModule,
    GraphQLModule.forRoot({
      driver: ApolloFederationDriver,
      cacheControl: {
        defaultMaxAge: 5,
      },
      plugins: [
        responseCachePlugin(),
        ApolloServerPluginCacheControl({ defaultMaxAge: 5 }),
      ],
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      typePaths: ['**/*.graphql'],
      // autoSchemaFile: {
      //   federation: 2,
      // },
    }),
  ],
  controllers: [CatalogController],
  providers: [
    RolesGuard,
    JwtStrategy,
    JwtAuthGuard,
    IsAuthenticated,
    SessionSerializer,
    ConfigService,
    JwtService,
    ProductResolver,
    CategoryResolver,
    ProductService,
    ProductRepository,
    {
      provide: APP_FILTER,
      useClass: GraphQLExceptionFilter,
    },
  ],
  exports: [],
})
export class ProductModule {}
