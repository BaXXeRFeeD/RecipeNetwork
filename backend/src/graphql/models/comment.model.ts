import {
  Field,
  GraphQLISODateTime,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import { UserModel } from './user.model';

@ObjectType()
export class CommentModel {
  @Field(() => Int)
  id!: number;

  @Field()
  content!: string;

  @Field(() => Int)
  recipeId!: number;

  @Field(() => Int)
  userId!: number;

  @Field(() => UserModel, { nullable: true })
  user?: UserModel;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}
