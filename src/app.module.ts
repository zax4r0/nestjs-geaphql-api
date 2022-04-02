/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { CaslModule } from './casl/casl.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './articles/article.module';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { logger } from './common/utils/logger';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { GobalJwtAuthGuard } from './auth/guards/global-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env?.DATABASE_URL as string),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      autoSchemaFile: true,
      playground: true,
      debug: true,
      // plugins: [ApolloServerPluginLandingPageLocalDefault()],
      installSubscriptionHandlers: true,
      context: ({ req, res }) => {
        // Get the cookie from request
        return { req, res };
      },
      cors: {
        credentials: true,
        origin: process.env?.ORIGIN?.split(', ') || true,
      },
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      formatError: (error: GraphQLError) => {
        logger.warn(error);
        if (error.message === 'VALIDATION_ERROR') {
          const extensions = {
            code: 'VALIDATION_ERROR',
            errors: [],
          };
          // @ts-ignore
          Object.keys(error?.extensions?.invalidArgs).forEach((key) => {
            // @ts-ignore
            const constraints = [];
            Object.keys(
              // @ts-ignore

              error?.extensions?.invalidArgs[key].constraints,
            ).forEach((_key) => {
              constraints.push(
                // @ts-ignore
                error.extensions?.invalidArgs[key].constraints[_key],
              );
            });
            extensions.errors.push({
              // @ts-ignore
              field: error.extensions.invalidArgs[key].property,
              // @ts-ignore
              errors: constraints,
            });
          });
          const graphQLFormattedError: GraphQLFormattedError = {
            message: 'VALIDATION_ERROR',
            extensions: extensions,
          };
          return graphQLFormattedError;
        } else {
          return error;
        }
      },
    }),
    AuthModule,
    CaslModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GobalJwtAuthGuard,
    },
  ],
})
export class AppModule {}
