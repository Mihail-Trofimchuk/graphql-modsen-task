import {
  HttpException,
  HttpStatus,
  Module,
  UnauthorizedException,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver } from '@nestjs/apollo';

import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { verify } from 'jsonwebtoken';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { ApolloServerPluginCacheControl } from 'apollo-server-core';

import { DbModule } from '@app/db';
import { SessionSerializer } from '@app/auth';
import {
  INVALID_AUTH_TOKEN,
  INVALID_BEARER_TOKEN,
} from './api-gateway.constants';

const getToken = (authToken: string): string => {
  const match = authToken.match(/^Bearer (.*)$/);
  if (!match || match.length < 2) {
    throw new HttpException(
      { message: INVALID_BEARER_TOKEN },
      HttpStatus.UNAUTHORIZED,
    );
  }
  return match[1];
};

const decodeToken = (tokenString: string) => {
  const decoded = verify(tokenString, process.env.JWT_ACCESS_TOKEN_SECRET);
  if (!decoded) {
    throw new HttpException(
      { message: INVALID_AUTH_TOKEN },
      HttpStatus.UNAUTHORIZED,
    );
  }
  return decoded;
};

const handleAuth = ({ req }) => {
  try {
    if (req.headers.authorization) {
      const token = getToken(req.headers.authorization);
      const decoded: any = decodeToken(token);
      return {
        user_id: decoded.user_id,
        role: decoded.role,
        authorization: `${req.headers.authorization}`,
      };
    }
  } catch (err) {
    throw new UnauthorizedException(
      'User unauthorized with invalid authorization Headers',
    );
  }
};

@Module({
  imports: [
    DbModule,
    GraphQLModule.forRoot({
      driver: ApolloGatewayDriver,
      server: {
        context: handleAuth,
      },
      cacheControl: {
        defaultMaxAge: 5,
      },
      plugins: [
        responseCachePlugin(),
        ApolloServerPluginCacheControl({ defaultMaxAge: 5 }),
      ],
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      gateway: {
        buildService: ({ url }) => {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }: any) {
              request.http.headers.set('user_id', context.user_id);
              request.http.headers.set('authorization', context.authorization);
              request.http.headers.set('role', context.role);
            },
          });
        },
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'account', url: 'http://localhost:3003/graphql' },
            { name: 'cart', url: 'http://localhost:3005/graphql' },
            { name: 'catalog', url: 'http://localhost:3002/graphql' },
            { name: 'order', url: 'http://localhost:3004/graphql' },
          ],
        }),
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: 'SESSION_SERIALIZER',
      useValue: new SessionSerializer(),
    },
  ],
})
export class ApiGatewayModule {}
