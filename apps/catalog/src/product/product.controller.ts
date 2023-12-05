import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ProductService } from './product.service';

@Controller()
export class CatalogController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('get_product')
  async searchUserCart(@Payload() { id }: { id: number }) {
    console.log(id);

    const product = await this.productService.getProductsById(id);
    console.log(product);
    return JSON.stringify(product);
  }
}
