import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RecipeStepModel {
  @Field()
  description!: string;

  @Field(() => Int)
  position!: number;

  @Field(() => String, { nullable: true })
  imageUrl!: string | null;
}
