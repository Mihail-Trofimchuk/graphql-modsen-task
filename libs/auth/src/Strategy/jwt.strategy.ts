// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Request as RequestType } from 'express';
// import { UserService } from 'apps/account/src/user/user.service';

// @Injectable()
// export class JwtAuthStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly userService: UserService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         JwtAuthStrategy.extractJWT,
//         ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ]),
//       ignoreExpiration: false,
//       secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
//     });
//   }
//   static extractJWT(req: RequestType): string | null {
//     console.log(req.cookies);
//     if (req.cookies && 'access_token' in req.cookies) {
//       return req.cookies['access_token'];
//     }
//     return null;
//   }
//   async validate(user_Id: number) {
//     const user = this.userService.findUserById(user_Id);
//     console.log(user);
//     if (!user) {
//       new NotFoundException('User_Not_Found');
//     }
//     return user;
//   }
// }

export interface JwtPayload {
  user_id: number;
  role: Role;
}

import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PassportStrategy } from '@nestjs/passport';

// import { AuthenticationError } from 'apollo-server-core';
import { ConfigService } from '@nestjs/config';
import Role from '../Enum/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    return { user_id: payload.user_id, role: payload.role };
    // const user = await this.userService.validateJwtPayload(payload);
    // if (!user) {
    //   throw new AuthenticationError(
    //     'Could ********** not log-in with the provided credentials',
    //   );
    // }

    // return user;
  }
}
