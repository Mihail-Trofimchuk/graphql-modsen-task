import { NestFactory } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { CartModule } from './cart/cart.module';

async function bootstrap() {
  const app = await NestFactory.create(CartModule);
  const corsOptions: CorsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'cart-service-consumer',
      },
    },
  });

  await microservice.listen();

  app.enableCors(corsOptions);
  await app.listen(3005);
}
bootstrap();
