import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order/order.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  await app.listen(3004);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
        // clientId: 'user-service',
      },
      consumer: {
        groupId: 'order-service-consumer',
      },
    },
  });

  await microservice.listen();
}
bootstrap();
