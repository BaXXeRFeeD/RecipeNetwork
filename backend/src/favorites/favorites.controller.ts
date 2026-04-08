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
import { FavoritesService } from './favorites.service';

@ApiTags('favorites')
@Controller('recipes/:recipeId/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.favoritesService.create(recipeId, currentUser.userId);
  }

  @Get()
  findByRecipe(@Param('recipeId', ParseIntPipe) recipeId: number) {
    return this.favoritesService.findByRecipe(recipeId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.favoritesService.remove(recipeId, currentUser.userId);
  }
}
