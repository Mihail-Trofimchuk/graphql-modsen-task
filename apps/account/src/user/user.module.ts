import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DbModule } from '@app/db';
import {
  GQLAuthGuard,
  JwtAuthGuard,
  JwtStrategy,
  SessionLocalAuthGuard,
  SessionSerializer,
} from '@app/auth';
import { LocalStrategy } from '@app/auth/Strategy/local.strategy';

import { Cart } from 'apps/cart/src/cart/entities/cart.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';

export const getJWTConfig = (): JwtModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    global: true,
  }),
});

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync(getJWTConfig()),
    PassportModule,
    DbModule,
    TypeOrmModule.forFeature([User, Cart]),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'USER_CLIENT',
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: () => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: ['localhost:9092'],
                clientId: 'user-service',
              },
              consumer: {
                groupId: 'user-service-consumer',
              },
            },
          }),
        },
      ],
    }),
  ],
  controllers: [UserController],
  providers: [
    LocalStrategy,
    UserResolver,
    UserService,
    UserRepository,
    JwtService,
    JwtStrategy,
    JwtAuthGuard,
    SessionLocalAuthGuard,
    SessionSerializer,
    GQLAuthGuard,
  ],
})
export class UserModule {}
