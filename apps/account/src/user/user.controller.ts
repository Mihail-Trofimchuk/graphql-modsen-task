import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('search_user')
  async searchUser(@Payload() { user_id }: { user_id: string }) {
    const user = await this.userService.findUserById(Number(user_id));
    return JSON.stringify(user);
  }
}
