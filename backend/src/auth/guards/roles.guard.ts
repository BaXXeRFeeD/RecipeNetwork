import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';

import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/entities/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const user = this.extractUser(context);

    if (!user) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }

  private extractUser(context: ExecutionContext): AuthenticatedUser | null {
    if (context.getType<'http' | 'graphql'>() === 'graphql') {
      return (
        GqlExecutionContext.create(context).getContext().req
          .user ?? null
      );
    }

    return context.switchToHttp().getRequest().user ?? null;
  }
}
