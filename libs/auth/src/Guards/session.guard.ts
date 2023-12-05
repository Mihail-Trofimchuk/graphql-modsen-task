import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SessionLocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctxRequest = GqlExecutionContext.create(context).getContext().req;
    //console.log(ctxRequest);
    await super.logIn(ctxRequest);
    //console.log(await super.logIn(ctxRequest));
    return ctxRequest ? true : false;
  }
}
