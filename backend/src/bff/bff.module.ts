import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from '../comments/entities/comment.entity';
import { Favorite } from '../favorites/entities/favorite.entity';
import { Like } from '../likes/entities/like.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { User } from '../users/entities/user.entity';
import { BffController } from './bff.controller';
import { BffService } from './bff.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Recipe,
      Comment,
      Like,
      Favorite,
      Subscription,
    ]),
  ],
  controllers: [BffController],
  providers: [BffService],
  exports: [BffService],
})
export class BffModule {}
