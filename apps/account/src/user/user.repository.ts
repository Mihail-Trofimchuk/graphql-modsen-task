import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/input/create-user.input';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findUserById(user_id: number): Promise<User> {
    return await this.userRepository.findOneBy({ user_id });
  }

  async findUserByCartId(id: number) {
    return await this.userRepository.findOne({
      where: { cart: { id: id } },
    });
  }

  async createUser(
    { displayName, email }: CreateUserInput,
    passwordHash: string,
    stripeCustomerId: string,
  ) {
    const newUser = this.userRepository.create({
      email,
      displayName,
      passwordHash,
      stripeCustomerId,
    });
    const savedUser = await this.userRepository.save(newUser);

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }
}
