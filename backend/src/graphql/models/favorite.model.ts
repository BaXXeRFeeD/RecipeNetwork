import {
  Field,
  GraphQLISODateTime,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import { UserModel } from './user.model';

@ObjectType()
export class FavoriteModel {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  recipeId!: number;

  @Field(() => Int)
  userId!: number;

  @Field(() => UserModel, { nullable: true })
  user?: UserModel;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}
