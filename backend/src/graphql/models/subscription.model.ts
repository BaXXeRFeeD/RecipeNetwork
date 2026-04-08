import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';

import { UserModel } from './user.model';

@ObjectType()
export class SubscriptionModel {
  @Field(() => Int)
  subscriberId!: number;

  @Field(() => Int)
  targetUserId!: number;

  @Field(() => UserModel, { nullable: true })
  subscriberUser?: UserModel;

  @Field(() => UserModel, { nullable: true })
  targetUser?: UserModel;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}
