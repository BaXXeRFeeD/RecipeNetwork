import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { FavoritesService } from '../../favorites/favorites.service';
import { LikesService } from '../../likes/likes.service';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service';
import { ActionResultModel } from '../models/action-result.model';
import { FavoriteModel } from '../models/favorite.model';
import { LikeModel } from '../models/like.model';
import { SubscriptionModel } from '../models/subscription.model';

@Resolver()
export class EngagementResolver {
  constructor(
    private readonly likesService: LikesService,
    private readonly favoritesService: FavoritesService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Query(() => [LikeModel])
  recipeLikes(@Args('recipeId', { type: () => Int }) recipeId: number) {
    return this.likesService.findByRecipe(recipeId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => LikeModel)
  likeRecipe(
    @Args('recipeId', { type: () => Int }) recipeId: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.likesService.create(recipeId, currentUser.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ActionResultModel)
  unlikeRecipe(
    @Args('recipeId', { type: () => Int }) recipeId: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.likesService.remove(recipeId, currentUser.userId);
  }

  @Query(() => [FavoriteModel])
  recipeFavorites(@Args('recipeId', { type: () => Int }) recipeId: number) {
    return this.favoritesService.findByRecipe(recipeId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => FavoriteModel)
  favoriteRecipe(
    @Args('recipeId', { type: () => Int }) recipeId: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.favoritesService.create(recipeId, currentUser.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ActionResultModel)
  unfavoriteRecipe(
    @Args('recipeId', { type: () => Int }) recipeId: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.favoritesService.remove(recipeId, currentUser.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SubscriptionModel)
  subscribeToUser(
    @Args('targetUserId', { type: () => Int }) targetUserId: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.subscriptionsService.subscribe(currentUser.userId, targetUserId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ActionResultModel)
  unsubscribeFromUser(
    @Args('targetUserId', { type: () => Int }) targetUserId: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.subscriptionsService.unsubscribe(
      currentUser.userId,
      targetUserId,
    );
  }
}
