import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Recipe } from '../recipes/entities/recipe.entity';
import { User } from '../users/entities/user.entity';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(recipeId: number, userId: number): Promise<Favorite> {
    await this.ensureRecipeExists(recipeId);
    await this.ensureUserExists(userId);

    const existingFavorite = await this.favoritesRepository.findOne({
      where: {
        recipeId,
        userId,
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Рецепт уже добавлен в избранное');
    }

    const favorite = this.favoritesRepository.create({
      recipeId,
      userId,
    });

    const savedFavorite = await this.favoritesRepository.save(favorite);

    return this.favoritesRepository.findOneOrFail({
      where: { id: savedFavorite.id },
      relations: {
        user: true,
      },
    });
  }

  async findByRecipe(recipeId: number): Promise<Favorite[]> {
    await this.ensureRecipeExists(recipeId);

    return this.favoritesRepository.find({
      where: { recipeId },
      relations: {
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async remove(recipeId: number, userId: number): Promise<{ message: string }> {
    const favorite = await this.favoritesRepository.findOne({
      where: {
        recipeId,
        userId,
      },
    });

    if (!favorite) {
      throw new NotFoundException('Избранное не найдено');
    }

    await this.favoritesRepository.delete(favorite.id);

    return {
      message: 'Рецепт удалён из избранного',
    };
  }

  private async ensureRecipeExists(recipeId: number): Promise<void> {
    const recipe = await this.recipesRepository.findOne({
      where: { id: recipeId },
    });

    if (!recipe) {
      throw new NotFoundException(`Рецепт с id=${recipeId} не найден`);
    }
  }

  private async ensureUserExists(userId: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с id=${userId} не найден`);
    }
  }
}
