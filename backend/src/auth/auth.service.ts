import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user-role.enum';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/authenticated-user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const role = this.resolveRole(createUserDto.email);
    const user = await this.usersService.create(createUserDto, role);

    return this.buildAuthResponse(user);
  }

  async login(loginDto: LoginDto) {
    const normalizedLogin = loginDto.login.trim().toLowerCase();

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('LOWER(user.email) = :normalizedLogin', { normalizedLogin })
      .orWhere('LOWER(user.username) = :normalizedLogin', {
        normalizedLogin,
      })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const isValidPassword = await compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const profile = await this.usersService.findOne(user.id);
    return this.buildAuthResponse(profile);
  }

  async me(userId: number) {
    return this.usersService.findOne(userId);
  }

  private async buildAuthResponse(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user,
    };
  }

  private resolveRole(email: string): UserRole {
    const adminEmails = (this.configService.get<string>('ADMIN_EMAILS') ?? '')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);

    if (adminEmails.includes(email.trim().toLowerCase())) {
      return UserRole.ADMIN;
    }

    return UserRole.USER;
  }
}
