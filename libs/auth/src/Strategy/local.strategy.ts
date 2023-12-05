import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'apps/account/src/user/user.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(Email: string, Password: string): Promise<any> {
    try {
      const userData = await this.authService.validateUser(Email, Password);
      //console.log(userData);
      return userData;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
