import { Field, InputType } from '@nestjs/graphql';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { RecipeCategory } from '../../recipes/entities/recipe-category.enum';
import { IngredientLineInput } from './ingredient-line.input';
import { RecipeStepInput } from './recipe-step.input';

@InputType()
export class CreateRecipeInput {
  @Field()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(255)
  title!: string;

  @Field()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(5000)
  description!: string;

  @Field(() => RecipeCategory)
  @IsEnum(RecipeCategory)
  category!: RecipeCategory;

  @Field(() => String, { nullable: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(2000000)
  photoUrl?: string;

  @Field(() => [IngredientLineInput])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IngredientLineInput)
  ingredients!: IngredientLineInput[];

  @Field(() => [RecipeStepInput])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RecipeStepInput)
  steps!: RecipeStepInput[];
}
