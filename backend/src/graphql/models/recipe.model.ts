import {
  Field,
  GraphQLISODateTime,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import { RecipeCategory } from '../../recipes/entities/recipe-category.enum';
import { IngredientLineModel } from './ingredient-line.model';
import { RecipeStepModel } from './recipe-step.model';
import { UserModel } from './user.model';

@ObjectType()
export class RecipeModel {
  @Field(() => Int)
  id!: number;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field(() => RecipeCategory)
  category!: RecipeCategory;

  @Field(() => String, { nullable: true })
  photoUrl!: string | null;

  @Field(() => [IngredientLineModel])
  ingredients!: IngredientLineModel[];

  @Field(() => [RecipeStepModel])
  steps!: RecipeStepModel[];

  @Field(() => Int)
  authorId!: number;

  @Field(() => UserModel, { nullable: true })
  author?: UserModel;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
