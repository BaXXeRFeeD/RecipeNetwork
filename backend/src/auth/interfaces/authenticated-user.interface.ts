import { UserRole } from '../../users/entities/user-role.enum';

export interface AuthenticatedUser {
  userId: number;
  username: string;
  role: UserRole;
}

export interface JwtPayload {
  sub: number;
  username: string;
  role: UserRole;
}
