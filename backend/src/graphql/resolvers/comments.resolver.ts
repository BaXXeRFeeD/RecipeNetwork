import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CommentsService } from '../../comments/comments.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { CreateCommentInput } from '../inputs/create-comment.input';
import { ActionResultModel } from '../models/action-result.model';
import { CommentModel } from '../models/comment.model';

@Resolver(() => CommentModel)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query(() => [CommentModel])
  comments(@Args('recipeId', { type: () => Int }) recipeId: number) {
    return this.commentsService.findByRecipe(recipeId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CommentModel)
  createComment(
    @Args('recipeId', { type: () => Int }) recipeId: number,
    @Args('input') input: CreateCommentInput,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.commentsService.create(recipeId, currentUser.userId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ActionResultModel)
  deleteComment(
    @Args('recipeId', { type: () => Int }) recipeId: number,
    @Args('commentId', { type: () => Int }) commentId: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.commentsService.remove(recipeId, commentId, currentUser);
  }
}
