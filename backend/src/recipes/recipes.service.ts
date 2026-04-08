import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import {
  deleteRecipeUploadByUrl,
  deleteRecipeUploadsByUrls,
} from '../uploads/upload-paths';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user-role.enum';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { QueryRecipesDto } from './dto/query-recipes.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { IngredientLine } from './entities/ingredient-line.vo';
import { Recipe } from './entities/recipe.entity';
import { RecipeStep } from './entities/recipe-step.vo';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    authorId: number,
    createRecipeDto: CreateRecipeDto,
  ): Promise<Recipe> {
    await this.ensureUserExists(authorId);

    const recipe = this.recipesRepository.create({
      authorId,
      title: createRecipeDto.title.trim(),
      description: createRecipeDto.description.trim(),
      category: createRecipeDto.category,
      photoUrl: createRecipeDto.photoUrl ?? null,
      ingredients: this.normalizeIngredients(createRecipeDto.ingredients),
      steps: this.normalizeSteps(createRecipeDto.steps),
    });

    const savedRecipe = await this.recipesRepository.save(recipe);
    return this.findOne(savedRecipe.id);
  }

  async findAll(query: QueryRecipesDto): Promise<Recipe[]> {
    const qb = this.recipesRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.author', 'author')
      .orderBy('recipe.createdAt', 'DESC');

    this.applyFilters(qb, query);

    return qb.getMany();
  }

  async findOne(id: number): Promise<Recipe> {
    const recipe = await this.recipesRepository.findOne({
      where: { id },
      relations: {
        author: true,
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Рецепт с id=${id} не найден`);
    }

    return recipe;
  }

  async update(
    id: number,
    updateRecipeDto: UpdateRecipeDto,
    actor: AuthenticatedUser,
  ): Promise<Recipe> {
    const recipe = await this.findOne(id);
    this.ensureCanManageRecipe(recipe, actor);
    const previousPhotoUrl = recipe.photoUrl;
    const previousStepImageUrls = this.collectStepImageUrls(recipe.steps);

    if (updateRecipeDto.title !== undefined) {
      recipe.title = updateRecipeDto.title.trim();
    }

    if (updateRecipeDto.description !== undefined) {
      recipe.description = updateRecipeDto.description.trim();
    }

    if (updateRecipeDto.category !== undefined) {
      recipe.category = updateRecipeDto.category;
    }

    if (updateRecipeDto.photoUrl !== undefined) {
      recipe.photoUrl = updateRecipeDto.photoUrl ?? null;
    }

    if (updateRecipeDto.ingredients !== undefined) {
      recipe.ingredients = this.normalizeIngredients(updateRecipeDto.ingredients);
    }

    if (updateRecipeDto.steps !== undefined) {
      recipe.steps = this.normalizeSteps(updateRecipeDto.steps);
    }

    await this.recipesRepository.save(recipe);
    const nextStepImageUrls = this.collectStepImageUrls(recipe.steps);

    if (
      updateRecipeDto.photoUrl !== undefined &&
      previousPhotoUrl !== recipe.photoUrl
    ) {
      await deleteRecipeUploadByUrl(previousPhotoUrl);
    }

    if (updateRecipeDto.steps !== undefined) {
      const nextStepImageUrlSet = new Set(nextStepImageUrls);
      await deleteRecipeUploadsByUrls(
        previousStepImageUrls.filter((url) => !nextStepImageUrlSet.has(url)),
      );
    }

    return this.findOne(recipe.id);
  }

  async remove(
    id: number,
    actor: AuthenticatedUser,
  ): Promise<{ message: string }> {
    const recipe = await this.findOne(id);
    this.ensureCanManageRecipe(recipe, actor);
    await this.recipesRepository.delete(id);
    await deleteRecipeUploadsByUrls([
      recipe.photoUrl,
      ...this.collectStepImageUrls(recipe.steps),
    ]);

    return {
      message: `Рецепт с id=${id} удалён`,
    };
  }

  private applyFilters(
    qb: SelectQueryBuilder<Recipe>,
    query: QueryRecipesDto,
  ): void {
    if (query.authorId !== undefined) {
      qb.andWhere('recipe.authorId = :authorId', {
        authorId: query.authorId,
      });
    }

    if (query.category !== undefined) {
      qb.andWhere('recipe.category = :category', {
        category: query.category,
      });
    }

    if (query.search !== undefined && query.search.length > 0) {
      qb.andWhere(
        '(LOWER(recipe.title) LIKE :search OR LOWER(recipe.description) LIKE :search)',
        {
          search: `%${query.search.toLowerCase()}%`,
        },
      );
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

  private normalizeIngredients(ingredients: IngredientLine[]): IngredientLine[] {
    if (ingredients.length === 0) {
      throw new BadRequestException(
        'Рецепт должен содержать хотя бы один ингредиент',
      );
    }

    const positions = new Set<number>();

    const normalized = ingredients
      .map((ingredient) => ({
        name: ingredient.name.trim(),
        quantity: ingredient.quantity.trim(),
        unit: ingredient.unit.trim(),
        position: ingredient.position,
      }))
      .sort((a, b) => a.position - b.position);

    for (const ingredient of normalized) {
      if (positions.has(ingredient.position)) {
        throw new BadRequestException(
          'Позиции ингредиентов должны быть уникальными',
        );
      }

      positions.add(ingredient.position);
    }

    return normalized;
  }

  private normalizeSteps(steps: RecipeStep[]): RecipeStep[] {
    if (steps.length === 0) {
      throw new BadRequestException(
        'Рецепт должен содержать хотя бы один шаг приготовления',
      );
    }

    const positions = new Set<number>();

    const normalized = steps
      .map((step) => ({
        description: step.description.trim(),
        position: step.position,
        imageUrl: step.imageUrl?.trim() || null,
      }))
      .sort((a, b) => a.position - b.position);

    for (const step of normalized) {
      if (positions.has(step.position)) {
        throw new BadRequestException(
          'Позиции шагов должны быть уникальными',
        );
      }

      positions.add(step.position);
    }

    return normalized;
  }

  private collectStepImageUrls(steps: RecipeStep[] | undefined): string[] {
    return (steps ?? [])
      .map((step) => step.imageUrl)
      .filter((imageUrl): imageUrl is string => typeof imageUrl === 'string' && imageUrl.length > 0);
  }

  private ensureCanManageRecipe(
    recipe: Recipe,
    actor: AuthenticatedUser,
  ): void {
    if (
      actor.role !== UserRole.ADMIN &&
      recipe.authorId !== actor.userId
    ) {
      throw new ForbiddenException(
        'Недостаточно прав для изменения этого рецепта',
      );
    }
  }
}
