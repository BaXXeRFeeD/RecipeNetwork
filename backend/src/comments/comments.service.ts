import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Recipe } from '../recipes/entities/recipe.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user-role.enum';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    recipeId: number,
    userId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    await this.ensureRecipeExists(recipeId);
    await this.ensureUserExists(userId);

    const comment = this.commentsRepository.create({
      recipeId,
      userId,
      content: createCommentDto.content.trim(),
    });

    const savedComment = await this.commentsRepository.save(comment);
    return this.findOne(savedComment.id, recipeId);
  }

  async findByRecipe(recipeId: number): Promise<Comment[]> {
    await this.ensureRecipeExists(recipeId);

    return this.commentsRepository.find({
      where: { recipeId },
      relations: {
        user: true,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async remove(
    recipeId: number,
    commentId: number,
    actor: AuthenticatedUser,
  ): Promise<{ message: string }> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId, recipeId },
    });

    if (!comment) {
      throw new NotFoundException(
        `Комментарий с id=${commentId} для recipeId=${recipeId} не найден`,
      );
    }

    if (
      actor.role !== UserRole.ADMIN &&
      comment.userId !== actor.userId
    ) {
      throw new ForbiddenException(
        'Недостаточно прав для удаления этого комментария',
      );
    }

    await this.commentsRepository.delete(commentId);

    return {
      message: `Комментарий с id=${commentId} удалён`,
    };
  }

  private async findOne(id: number, recipeId: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id, recipeId },
      relations: {
        user: true,
      },
    });

    if (!comment) {
      throw new NotFoundException(`Комментарий с id=${id} не найден`);
    }

    return comment;
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
