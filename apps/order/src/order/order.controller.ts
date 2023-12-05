import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('create_customer')
  async createCustomer(@Payload() { email }: { email: string }) {
    const customer = await this.orderService.createCustomer(email);
    return JSON.stringify(customer);
  }
}
