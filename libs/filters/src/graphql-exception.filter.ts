import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';

import { ApolloError } from 'apollo-server-express';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const gqlHost = GqlArgumentsHost.create(host);

    if (exception instanceof HttpException) {
      const errors = exception.getResponse() as any;
      const message = errors.message || 'Error';
      const code = exception.getStatus();

      return new ApolloError(message, code.toString());
    }

    const message = 'Server error';
    const code = '500';

    return new ApolloError(message, code);
  }
}
