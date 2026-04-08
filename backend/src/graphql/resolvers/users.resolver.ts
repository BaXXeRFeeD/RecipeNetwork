import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { UsersService } from '../../users/users.service';
import { CreateUserInput } from '../inputs/create-user.input';
import { UpdateUserInput } from '../inputs/update-user.input';
import { ActionResultModel } from '../models/action-result.model';
import { RecipeModel } from '../models/recipe.model';
import { SubscriptionModel } from '../models/subscription.model';
import { UserModel } from '../models/user.model';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserModel])
  users() {
    return this.usersService.findAll();
  }

  @Query(() => UserModel)
  user(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Query(() => [RecipeModel])
  userRecipes(@Args('userId', { type: () => Int }) userId: number) {
    return this.usersService.findUserRecipes(userId);
  }

  @Query(() => [SubscriptionModel])
  following(@Args('userId', { type: () => Int }) userId: number) {
    return this.usersService.findFollowing(userId);
  }

  @Query(() => [SubscriptionModel])
  followers(@Args('userId', { type: () => Int }) userId: number) {
    return this.usersService.findFollowers(userId);
  }

  @Mutation(() => UserModel)
  createUser(@Args('input') input: CreateUserInput) {
    return this.usersService.create(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserModel)
  updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateUserInput,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.usersService.update(id, input, currentUser);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ActionResultModel)
  deleteUser(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.usersService.remove(id, currentUser);
  }
}
