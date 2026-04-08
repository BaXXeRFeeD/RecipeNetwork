import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Recipe } from '../recipes/entities/recipe.entity';
import { User } from '../users/entities/user.entity';
import { Like } from './entities/like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(recipeId: number, userId: number): Promise<Like> {
    await this.ensureRecipeExists(recipeId);
    await this.ensureUserExists(userId);

    const existingLike = await this.likesRepository.findOne({
      where: {
        recipeId,
        userId,
      },
    });

    if (existingLike) {
      throw new ConflictException('Лайк уже существует');
    }

    const like = this.likesRepository.create({
      recipeId,
      userId,
    });

    const savedLike = await this.likesRepository.save(like);

    return this.likesRepository.findOneOrFail({
      where: { id: savedLike.id },
      relations: {
        user: true,
      },
    });
  }

  async findByRecipe(recipeId: number): Promise<Like[]> {
    await this.ensureRecipeExists(recipeId);

    return this.likesRepository.find({
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
    const like = await this.likesRepository.findOne({
      where: {
        recipeId,
        userId,
      },
    });

    if (!like) {
      throw new NotFoundException('Лайк не найден');
    }

    await this.likesRepository.delete(like.id);

    return {
      message: 'Лайк удалён',
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
