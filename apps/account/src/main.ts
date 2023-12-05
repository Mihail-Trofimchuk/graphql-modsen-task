import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

import { AccountModule } from './account.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AccountModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);
  const SESSION_SECRET = configService.get<string>('SESSION_SECRET');
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'user-service-consumer',
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

  app.use(cookieParser());
  app.enableCors();
  await app.listen(3003);
}
bootstrap();
