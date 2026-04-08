import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import './graphql.enums';
import { CommentsModule } from '../comments/comments.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { LikesModule } from '../likes/likes.module';
import { RecipesModule } from '../recipes/recipes.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './resolvers/auth.resolver';
import { CommentsResolver } from './resolvers/comments.resolver';
import { EngagementResolver } from './resolvers/engagement.resolver';
import { RecipesResolver } from './resolvers/recipes.resolver';
import { UsersResolver } from './resolvers/users.resolver';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RecipesModule,
    CommentsModule,
    LikesModule,
    FavoritesModule,
    SubscriptionsModule,
  ],
  providers: [
    AuthResolver,
    UsersResolver,
    RecipesResolver,
    CommentsResolver,
    EngagementResolver,
  ],
})
export class GraphqlApiModule {}
