import 'dotenv/config';

import { DataSource } from 'typeorm';
import { join } from 'path';

import { Comment } from '../comments/entities/comment.entity';
import { Favorite } from '../favorites/entities/favorite.entity';
import { Like } from '../likes/entities/like.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { User } from '../users/entities/user.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'recipe_network',
  entities: [User, Recipe, Comment, Like, Favorite, Subscription],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  synchronize: false,
  logging: String(process.env.DB_LOGGING ?? 'false') === 'true',
});
