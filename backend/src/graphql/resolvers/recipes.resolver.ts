import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { RecipesService } from '../../recipes/recipes.service';
import { CreateRecipeInput } from '../inputs/create-recipe.input';
import { QueryRecipesArgs } from '../inputs/query-recipes.args';
import { UpdateRecipeInput } from '../inputs/update-recipe.input';
import { ActionResultModel } from '../models/action-result.model';
import { RecipeModel } from '../models/recipe.model';

@Resolver(() => RecipeModel)
export class RecipesResolver {
  constructor(private readonly recipesService: RecipesService) {}

  @Query(() => [RecipeModel])
  recipes(@Args() filters: QueryRecipesArgs) {
    return this.recipesService.findAll(filters);
  }

  @Query(() => RecipeModel)
  recipe(@Args('id', { type: () => Int }) id: number) {
    return this.recipesService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => RecipeModel)
  createRecipe(
    @Args('input') input: CreateRecipeInput,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.recipesService.create(currentUser.userId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => RecipeModel)
  updateRecipe(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateRecipeInput,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.recipesService.update(id, input, currentUser);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ActionResultModel)
  deleteRecipe(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.recipesService.remove(id, currentUser);
  }
}
