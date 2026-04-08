import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ActionResultModel {
  @Field()
  message!: string;
}
