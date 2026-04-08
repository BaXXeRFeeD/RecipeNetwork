import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

import { RecipeCategory } from '../entities/recipe-category.enum';
import { IngredientLineDto } from './ingredient-line.dto';
import { RecipeStepDto } from './recipe-step.dto';

export class CreateRecipeDto {
  @ApiProperty({ example: 'Банановый смузи' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(255)
  title!: string;

  @ApiProperty({ example: 'Быстрый напиток на завтрак' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(5000)
  description!: string;

  @ApiProperty({ enum: RecipeCategory, example: RecipeCategory.DRINKS })
  @IsEnum(RecipeCategory)
  category!: RecipeCategory;

  @ApiPropertyOptional({ example: 'photoUrl' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(2000000)
  photoUrl?: string;

  @ApiProperty({ type: () => [IngredientLineDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IngredientLineDto)
  ingredients!: IngredientLineDto[];

  @ApiProperty({ type: () => [RecipeStepDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RecipeStepDto)
  steps!: RecipeStepDto[];
}
