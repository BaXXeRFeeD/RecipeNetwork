import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';

@ApiTags('comments')
@Controller('recipes/:recipeId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.commentsService.create(
      recipeId,
      currentUser.userId,
      createCommentDto,
    );
  }

  @Get()
  findByRecipe(@Param('recipeId', ParseIntPipe) recipeId: number) {
    return this.commentsService.findByRecipe(recipeId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  remove(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.commentsService.remove(recipeId, commentId, currentUser);
  }
}
