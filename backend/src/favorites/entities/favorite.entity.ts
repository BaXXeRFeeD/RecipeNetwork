import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Recipe } from '../../recipes/entities/recipe.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'favorites' })
@Index('uq_favorites_recipe_user', ['recipeId', 'userId'], { unique: true })
export class Favorite {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ name: 'recipe_id', type: 'int' })
  recipeId!: number;

  @Index()
  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe!: Recipe;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
