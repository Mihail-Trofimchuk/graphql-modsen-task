import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: CallableFunction): any {
    console.log(user);
    return done(null, user);
  }
  deserializeUser(payload: any, done: CallableFunction): any {
    console.log(payload);
    return done(null, payload);
  }
}
