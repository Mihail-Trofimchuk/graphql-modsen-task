// import { Test, TestingModule } from '@nestjs/testing';
// import { OrderService } from './order.service';
// import { OrderRepository } from './order.repository';
// import { ConfigService } from '@nestjs/config';

// describe('OrderService', () => {
//   let service: OrderService;

//   const MockOrderRepository = {};
//   const Mock_ORDER_CLIENT = {};

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         OrderService,
//         ConfigService,
//         OrderRepository,
//         {
//           provide: 'ORDER_CLIENT',
//           useValue: Mock_ORDER_CLIENT,
//         },
//       ],
//     })
//       .overrideProvider(OrderRepository)
//       .useValue(MockOrderRepository)

//       .compile();

//     service = module.get<OrderService>(OrderService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   it('', () => {});
// });

import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';

describe('OrderService', () => {
  let service: OrderService;
  let mockOrderRepository: Record<string, jest.Mock>;
  let mockKafkaClient;

  beforeEach(async () => {
    mockOrderRepository = {
      // Здесь можете добавить необходимые методы репозитория, если они используются в вашем коде.
      // Например: find: jest.fn(),
    };

    mockKafkaClient = {
      subscribeToResponseOf: jest.fn(),
      connect: jest.fn(() => of(undefined).toPromise()), // Мокируем connect, чтобы вернуть resolved Promise
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        ConfigService,
        OrderRepository,
        {
          provide: 'ORDER_CLIENT',
          useValue: mockKafkaClient,
        },
      ],
    })
      .overrideProvider(OrderRepository)
      .useValue(mockOrderRepository)
      .compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a customer', async () => {
    const email = 'test@example.com';

    // Мокируем метод stripe.customers.create
    const createStripeCustomerMock = jest.spyOn(
      service['stripe'].customers,
      'create',
    );

    const result = await service.createCustomer(email);

    // Проверяем, что метод был вызван с правильными аргументами
    expect(createStripeCustomerMock).toHaveBeenCalledWith({ email });

    // Проверяем, что результат соответствует ожидаемому
    expect(result).toEqual({ id: 'customer_id', email });
  });

  it('should subscribe to "search_user" response', () => {
    // Проверяем, что метод был вызван с правильным аргументом
    expect(mockKafkaClient.subscribeToResponseOf).toHaveBeenCalledWith(
      'search_user',
    );
  });

  it('should connect to kafka client', async () => {
    // Проверяем, что метод был вызван
    expect(mockKafkaClient.connect).toHaveBeenCalled();
  });
});
