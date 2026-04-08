import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

import { RecipeCategory } from '../../recipes/entities/recipe-category.enum';

@ArgsType()
export class QueryRecipesArgs {
  @Field(() => Int, { nullable: true })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  authorId?: number;

  @Field(() => RecipeCategory, { nullable: true })
  @IsOptional()
  @IsEnum(RecipeCategory)
  category?: RecipeCategory;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
