import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IngredientLineModel {
  @Field()
  name!: string;

  @Field()
  quantity!: string;

  @Field()
  unit!: string;

  @Field(() => Int)
  position!: number;
}
