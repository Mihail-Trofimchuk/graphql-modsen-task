import { Test, TestingModule } from '@nestjs/testing';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

describe('OrderResolver', () => {
  let resolver: OrderResolver;

  const MockOrderService = {
    charge: jest.fn((dto) => {
      return { id: Date.now(), ...dto };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderResolver, OrderService],
    })
      .overrideProvider(OrderService)
      .useValue(MockOrderService)
      .compile();

    resolver = module.get<OrderResolver>(OrderResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should createCharge', () => {
    expect(
      resolver.createCharge({ user_id: 2, shippingAddress: 'Mike' }),
    ).toEqual({
      id: expect.any(Number),
      shippingAddress: 'Mike',
      user_id: expect.any(Number),
    });

    expect(MockOrderService.charge).toHaveBeenCalledWith({
      shippingAddress: 'Mike',
      user_id: 2,
    });
  });
});
