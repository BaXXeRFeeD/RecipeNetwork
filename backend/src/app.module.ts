import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IncomingMessage } from 'http';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { BffModule } from './bff/bff.module';
import { validationSchema } from './config/validation.schema';
import { CommentsModule } from './comments/comments.module';
import { FavoritesModule } from './favorites/favorites.module';
import { getTypeOrmModuleOptions } from './database/typeorm.config';
import { GraphqlApiModule } from './graphql/graphql-api.module';
import { LikesModule } from './likes/likes.module';
import { RecipesModule } from './recipes/recipes.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot(getTypeOrmModuleOptions()),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      path: '/graphql',
      graphiql: true,
      context: ({ req }: { req: IncomingMessage }) => ({ req }),
    }),
    AuthModule,
    BffModule,
    UsersModule,
    RecipesModule,
    CommentsModule,
    LikesModule,
    FavoritesModule,
    SubscriptionsModule,
    UploadsModule,
    GraphqlApiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
