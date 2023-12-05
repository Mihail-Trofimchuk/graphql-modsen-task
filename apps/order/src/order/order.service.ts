import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreateOrderInput } from './dto/create-order.input';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { User } from 'apps/account/src/user/entities/user.entity';

@Injectable()
export class OrderService {
  private stripe: Stripe;
  constructor(
    private configService: ConfigService,
    private readonly orderRepository: OrderRepository,
    @Inject('ORDER_CLIENT') private kafkaClient: ClientKafka,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }
  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('search_user');

    await this.kafkaClient.connect();
  }

  public async createCustomer(email: string) {
    return this.stripe.customers.create({
      email,
    });
  }

  public async charge(createOrderInput: CreateOrderInput) {
    const user: User = await lastValueFrom(
      this.kafkaClient.send('search_user', {
        user_id: createOrderInput.user_id,
      }),
    );

    const order = await this.orderRepository.createOrder(
      user.user_id,
      createOrderInput.shippingAddress,
    );

    if (!order) {
      throw new NotFoundException(`Insufficient quantity for product`);
    }

    // await this.stripe.paymentIntents.create({
    //   amount: 234,
    //   customer: user.stripeCustomerId,
    //   currency: this.configService.get('STRIPE_CURRENCY'),
    //   confirm: true,
    //   automatic_payment_methods: {
    //     enabled: true,
    //     allow_redirects: 'never',
    //   },
    // });

    return order;
  }
}
