import { NestFactory } from '@nestjs/core';

import * as cookieParser from 'cookie-parser';

import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.use(cookieParser());

  app.enableCors({
    credentials: true,
  });
  await app.listen(3001);
}
bootstrap();
