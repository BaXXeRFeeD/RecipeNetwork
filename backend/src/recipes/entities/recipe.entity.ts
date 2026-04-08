import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Comment } from '../../comments/entities/comment.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { Like } from '../../likes/entities/like.entity';
import { User } from '../../users/entities/user.entity';
import { IngredientLine } from './ingredient-line.vo';
import { RecipeCategory } from './recipe-category.enum';
import { RecipeStep } from './recipe-step.vo';

@Entity({ name: 'recipes' })
export class Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', default: '' })
  description!: string;

  @Column({
    type: 'enum',
    enum: RecipeCategory,
  })
  @Index()
  category!: RecipeCategory;

  @Column({ name: 'photo_url', type: 'text', nullable: true })
  photoUrl!: string | null;

  @Column({ type: 'jsonb' })
  ingredients!: IngredientLine[];

  @Column({ type: 'jsonb' })
  steps!: RecipeStep[];

  @Index()
  @Column({ name: 'author_id', type: 'int' })
  authorId!: number;

  @ManyToOne(() => User, (user) => user.recipes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => Comment, (comment) => comment.recipe)
  comments!: Comment[];

  @OneToMany(() => Like, (like) => like.recipe)
  likes!: Like[];

  @OneToMany(() => Favorite, (favorite) => favorite.recipe)
  favorites!: Favorite[];
}
