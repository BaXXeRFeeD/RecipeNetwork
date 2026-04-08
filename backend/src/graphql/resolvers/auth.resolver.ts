import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthService } from '../../auth/auth.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { CreateUserInput } from '../inputs/create-user.input';
import { LoginInput } from '../inputs/login.input';
import { AuthPayloadModel } from '../models/auth-payload.model';
import { UserModel } from '../models/user.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayloadModel)
  register(@Args('input') input: CreateUserInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthPayloadModel)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserModel)
  me(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.authService.me(currentUser.userId);
  }
}
