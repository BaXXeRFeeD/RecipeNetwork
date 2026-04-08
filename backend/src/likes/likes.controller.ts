import {
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
import { LikesService } from './likes.service';

@ApiTags('likes')
@Controller('recipes/:recipeId/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.likesService.create(recipeId, currentUser.userId);
  }

  @Get()
  findByRecipe(@Param('recipeId', ParseIntPipe) recipeId: number) {
    return this.likesService.findByRecipe(recipeId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.likesService.remove(recipeId, currentUser.userId);
  }
}
