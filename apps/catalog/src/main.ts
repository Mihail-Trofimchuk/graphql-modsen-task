import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import * as session from 'express-session';
import * as passport from 'passport';
import { ProductModule } from './product/product.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  await app.listen(3002);

  const configService = app.get(ConfigService);
  const SESSION_SECRET = configService.get<string>('SESSION_SECRET');

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
        // clientId: 'user-service',
      },
      consumer: {
        groupId: 'catalog-service-consumer',
      },
    },
  });

  app.use(
    session({
      secret: SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  await microservice.listen();
}
bootstrap();
