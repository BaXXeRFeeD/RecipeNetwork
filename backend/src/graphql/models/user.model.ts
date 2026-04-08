import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';

import { UserRole } from '../../users/entities/user-role.enum';

@ObjectType()
export class UserModel {
  @Field(() => Int)
  id!: number;

  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field(() => UserRole)
  role!: UserRole;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}
