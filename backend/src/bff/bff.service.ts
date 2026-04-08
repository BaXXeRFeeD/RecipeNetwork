import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Comment } from '../comments/entities/comment.entity';
import { Favorite } from '../favorites/entities/favorite.entity';
import { Like } from '../likes/entities/like.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user-role.enum';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { QueryFeedDto } from './dto/query-feed.dto';

type RecipePreview = {
  id: number;
  title: string;
  description: string;
  category: string;
  photoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  ingredientsPreview: string[];
  author: {
    id: number;
    username: string;
    role: UserRole;
  };
  stats: {
    likes: number;
    comments: number;
    favorites: number;
  };
  viewer: {
    isLiked: boolean;
    isFavorited: boolean;
    isFollowingAuthor: boolean;
    canEdit: boolean;
  };
};

@Injectable()
export class BffService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
  ) {}

  async getFeed(
    query: QueryFeedDto,
    viewer: AuthenticatedUser | null,
  ) {
    if (query.followingOnly && !viewer) {
      return {
        items: [],
        meta: {
          page: query.page,
          limit: query.limit,
          total: 0,
          totalPages: 0,
        },
        summary: await this.buildFeedSummary(),
      };
    }

    const qb = this.recipesRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.author', 'author');

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

    if (query.search) {
      qb.andWhere(
        '(LOWER(recipe.title) LIKE :search OR LOWER(recipe.description) LIKE :search)',
        {
          search: `%${query.search.toLowerCase()}%`,
        },
      );
    }

    if (query.followingOnly && viewer) {
      qb.innerJoin(
        Subscription,
        'subscription',
        'subscription.targetUserId = recipe.authorId AND subscription.subscriberId = :viewerId',
        { viewerId: viewer.userId },
      );
    }

    qb.orderBy('recipe.createdAt', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit);

    const [recipes, total] = await qb.getManyAndCount();
    const items = await this.decorateRecipes(recipes, viewer);

    return {
      items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
      summary: await this.buildFeedSummary(),
    };
  }

  async getRecipeDetails(
    recipeId: number,
    viewer: AuthenticatedUser | null,
  ) {
    const recipe = await this.recipesRepository.findOne({
      where: { id: recipeId },
      relations: {
        author: true,
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Рецепт с id=${recipeId} не найден`);
    }

    const [preview] = await this.decorateRecipes([recipe], viewer);
    const comments = await this.commentsRepository.find({
      where: { recipeId },
      relations: {
        user: true,
      },
      order: {
        createdAt: 'ASC',
      },
    });

    return {
      ...preview,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      comments: comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          id: comment.user.id,
          username: comment.user.username,
          role: comment.user.role,
        },
        viewer: {
          canDelete:
            !!viewer &&
            (viewer.role === UserRole.ADMIN ||
              viewer.userId === comment.userId),
        },
      })),
    };
  }

  async getProfile(
    userId: number,
    viewer: AuthenticatedUser | null,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с id=${userId} не найден`);
    }

    const [recipes, followersCount, followingCount, likesReceived, relation] =
      await Promise.all([
        this.recipesRepository.find({
          where: { authorId: userId },
          relations: {
            author: true,
          },
          order: {
            createdAt: 'DESC',
          },
        }),
        this.subscriptionsRepository.count({
          where: { targetUserId: userId },
        }),
        this.subscriptionsRepository.count({
          where: { subscriberId: userId },
        }),
        this.likesRepository
          .createQueryBuilder('like')
          .innerJoin('like.recipe', 'recipe')
          .where('recipe.authorId = :userId', { userId })
          .getCount(),
        viewer
          ? this.subscriptionsRepository.findOne({
              where: {
                subscriberId: viewer.userId,
                targetUserId: userId,
              },
            })
          : null,
      ]);

    const recipeCards = await this.decorateRecipes(recipes, viewer);

    return {
      profile: {
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
      },
      stats: {
        recipes: recipeCards.length,
        followers: followersCount,
        following: followingCount,
        likesReceived,
      },
      viewer: {
        isOwner: viewer?.userId === userId,
        isFollowing: !!relation,
        canEdit:
          !!viewer &&
          (viewer.role === UserRole.ADMIN || viewer.userId === userId),
      },
      recipes: recipeCards,
    };
  }

  async getMyDashboard(viewer: AuthenticatedUser) {
    const user = await this.usersRepository.findOne({
      where: { id: viewer.userId },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с id=${viewer.userId} не найден`);
    }

    const [
      ownRecipes,
      favoriteRecipes,
      followingSubscriptions,
      followersCount,
      likesReceived,
    ] = await Promise.all([
      this.recipesRepository.find({
        where: { authorId: viewer.userId },
        relations: {
          author: true,
        },
        order: {
          createdAt: 'DESC',
        },
      }),
      this.recipesRepository
        .createQueryBuilder('recipe')
        .innerJoin('recipe.favorites', 'favorite', 'favorite.userId = :userId', {
          userId: viewer.userId,
        })
        .leftJoinAndSelect('recipe.author', 'author')
        .orderBy('favorite.createdAt', 'DESC')
        .getMany(),
      this.subscriptionsRepository.find({
        where: { subscriberId: viewer.userId },
        relations: {
          targetUser: true,
        },
        order: {
          createdAt: 'DESC',
        },
      }),
      this.subscriptionsRepository.count({
        where: { targetUserId: viewer.userId },
      }),
      this.likesRepository
        .createQueryBuilder('like')
        .innerJoin('like.recipe', 'recipe')
        .where('recipe.authorId = :userId', { userId: viewer.userId })
        .getCount(),
    ]);

    const [recipes, favorites] = await Promise.all([
      this.decorateRecipes(ownRecipes, viewer),
      this.decorateRecipes(favoriteRecipes, viewer),
    ]);

    const followingIds = followingSubscriptions.map(
      (subscription) => subscription.targetUserId,
    );
    const recipeCountsByAuthor = await this.countRecipesByAuthors(followingIds);
    const followerCountsByAuthor = await this.countFollowersByAuthors(followingIds);

    return {
      profile: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      stats: {
        recipes: recipes.length,
        favorites: favorites.length,
        following: followingSubscriptions.length,
        followers: followersCount,
        likesReceived,
      },
      recipes,
      favorites,
      following: followingSubscriptions.map((subscription) => ({
        id: subscription.targetUser.id,
        username: subscription.targetUser.username,
        role: subscription.targetUser.role,
        recipesCount: recipeCountsByAuthor.get(subscription.targetUser.id) ?? 0,
        followersCount:
          followerCountsByAuthor.get(subscription.targetUser.id) ?? 0,
      })),
    };
  }

  private async decorateRecipes(
    recipes: Recipe[],
    viewer: AuthenticatedUser | null,
  ): Promise<RecipePreview[]> {
    if (recipes.length === 0) {
      return [];
    }

    const recipeIds = recipes.map((recipe) => recipe.id);
    const authorIds = [...new Set(recipes.map((recipe) => recipe.authorId))];

    const [
      likesCount,
      commentsCount,
      favoritesCount,
      likedRecipeIds,
      favoritedRecipeIds,
      followedAuthorIds,
    ] = await Promise.all([
      this.aggregateRecipeCounts(this.likesRepository, recipeIds),
      this.aggregateRecipeCounts(this.commentsRepository, recipeIds),
      this.aggregateRecipeCounts(this.favoritesRepository, recipeIds),
      viewer
        ? this.likesRepository.find({
            select: { recipeId: true },
            where: {
              recipeId: In(recipeIds),
              userId: viewer.userId,
            },
          })
        : [],
      viewer
        ? this.favoritesRepository.find({
            select: { recipeId: true },
            where: {
              recipeId: In(recipeIds),
              userId: viewer.userId,
            },
          })
        : [],
      viewer
        ? this.subscriptionsRepository.find({
            select: { targetUserId: true },
            where: {
              subscriberId: viewer.userId,
              targetUserId: In(authorIds),
            },
          })
        : [],
    ]);

    const likedSet = new Set(likedRecipeIds.map((entry) => entry.recipeId));
    const favoritedSet = new Set(
      favoritedRecipeIds.map((entry) => entry.recipeId),
    );
    const followingSet = new Set(
      followedAuthorIds.map((entry) => entry.targetUserId),
    );

    return recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      category: recipe.category,
      photoUrl: recipe.photoUrl,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
      ingredientsPreview: recipe.ingredients
        .slice(0, 3)
        .map((ingredient) =>
          `${ingredient.name} ${ingredient.quantity} ${ingredient.unit}`.trim(),
        ),
      author: {
        id: recipe.author.id,
        username: recipe.author.username,
        role: recipe.author.role,
      },
      stats: {
        likes: likesCount.get(recipe.id) ?? 0,
        comments: commentsCount.get(recipe.id) ?? 0,
        favorites: favoritesCount.get(recipe.id) ?? 0,
      },
      viewer: {
        isLiked: likedSet.has(recipe.id),
        isFavorited: favoritedSet.has(recipe.id),
        isFollowingAuthor: followingSet.has(recipe.authorId),
        canEdit:
          !!viewer &&
          (viewer.role === UserRole.ADMIN ||
            viewer.userId === recipe.authorId),
      },
    }));
  }

  private async aggregateRecipeCounts(
    repository: Repository<Like> | Repository<Comment> | Repository<Favorite>,
    recipeIds: number[],
  ): Promise<Map<number, number>> {
    if (recipeIds.length === 0) {
      return new Map<number, number>();
    }

    const rows = await repository
      .createQueryBuilder('entity')
      .select('entity.recipeId', 'recipeId')
      .addSelect('COUNT(*)', 'count')
      .where('entity.recipeId IN (:...recipeIds)', { recipeIds })
      .groupBy('entity.recipeId')
      .getRawMany<{ recipeId: string; count: string }>();

    return new Map(
      rows.map((row) => [Number(row.recipeId), Number(row.count)]),
    );
  }

  private async buildFeedSummary() {
    const [recipes, authors] = await Promise.all([
      this.recipesRepository.count(),
      this.usersRepository.count(),
    ]);

    return {
      totalRecipes: recipes,
      totalAuthors: authors,
    };
  }

  private async countRecipesByAuthors(authorIds: number[]) {
    if (authorIds.length === 0) {
      return new Map<number, number>();
    }

    const rows = await this.recipesRepository
      .createQueryBuilder('recipe')
      .select('recipe.authorId', 'authorId')
      .addSelect('COUNT(*)', 'count')
      .where('recipe.authorId IN (:...authorIds)', { authorIds })
      .groupBy('recipe.authorId')
      .getRawMany<{ authorId: string; count: string }>();

    return new Map(
      rows.map((row) => [Number(row.authorId), Number(row.count)]),
    );
  }

  private async countFollowersByAuthors(authorIds: number[]) {
    if (authorIds.length === 0) {
      return new Map<number, number>();
    }

    const rows = await this.subscriptionsRepository
      .createQueryBuilder('subscription')
      .select('subscription.targetUserId', 'authorId')
      .addSelect('COUNT(*)', 'count')
      .where('subscription.targetUserId IN (:...authorIds)', { authorIds })
      .groupBy('subscription.targetUserId')
      .getRawMany<{ authorId: string; count: string }>();

    return new Map(
      rows.map((row) => [Number(row.authorId), Number(row.count)]),
    );
  }
}
