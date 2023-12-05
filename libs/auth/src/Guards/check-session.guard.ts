import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class IsAuthenticated implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    const ctxReq = GqlExecutionContext.create(context).getContext().req;

    // Проверяем, существует ли сессия
    console.log(ctxReq.session);

    //console.log(ctxReq);
    // console.log('Headers:', ctxReq.headers);
    // const token = ctxReq.headers.authorization.split('Bearer ')[1];
    // console.log('Token:', token);

    // console.log(ctxReq.user);
    // console.log('Is Authenticated:', ctxReq.isAuthenticated());
    // console.log(ctxReq.isAuthenticated());
    const AuthenticationStatus = ctxReq.isAuthenticated();
    console.log(AuthenticationStatus);
    if (!AuthenticationStatus) {
      throw new UnauthorizedException(
        'Authentication failed. User not authenticated.',
      );
    }
    return AuthenticationStatus;
  }
}
