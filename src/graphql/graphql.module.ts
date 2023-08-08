import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import formatGraphqlError from '../exception/exception.formatter';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: process.env.ENV == 'production' ? false : true,
      introspection: true,
      useGlobalPrefix: true,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/schema/graphql.schema.ts'),
        customScalarTypeMapping: {
          DateTime: 'Date',
        },
      },
      formatError: formatGraphqlError,
      context: ({ req, res }) => ({ headers: req.headers, res, req }),
    }),
  ],
})
export class AppGraphQLModule {}
