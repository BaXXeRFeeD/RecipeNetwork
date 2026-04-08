import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';

import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Recipe } from '../recipes/entities/recipe.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.enum';

@Injectable()
export class UsersService {
  private readonly saltRounds: number;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    private readonly configService: ConfigService,
  ) {
    this.saltRounds = Number(
      this.configService.get<string>('PASSWORD_SALT_ROUNDS') ?? 10,
    );
  }

  async create(
    createUserDto: CreateUserDto,
    role: UserRole = UserRole.USER,
  ): Promise<User> {
    await this.ensureUsernameIsAvailable(createUserDto.username);
    await this.ensureEmailIsAvailable(createUserDto.email);

    const passwordHash = await hash(createUserDto.password, this.saltRounds);

    const user = this.usersRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      passwordHash,
      role,
    });

    const savedUser = await this.usersRepository.save(user);
    return this.findOne(savedUser.id);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с id=${id} не найден`);
    }

    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    actor: AuthenticatedUser,
  ): Promise<User> {
    this.ensureCanManageUser(id, actor);

    const user = await this.findOne(id);

    if (
      updateUserDto.username !== undefined &&
      updateUserDto.username !== user.username
    ) {
      await this.ensureUsernameIsAvailable(updateUserDto.username);
    }

    if (updateUserDto.email !== undefined && updateUserDto.email !== user.email) {
      await this.ensureEmailIsAvailable(updateUserDto.email);
    }

    const patch: Partial<User> = {};

    if (updateUserDto.username !== undefined) {
      patch.username = updateUserDto.username;
    }

    if (updateUserDto.email !== undefined) {
      patch.email = updateUserDto.email;
    }

    if (updateUserDto.password !== undefined) {
      patch.passwordHash = await hash(updateUserDto.password, this.saltRounds);
    }

    await this.usersRepository.update(id, patch);
    return this.findOne(id);
  }

  async updateRole(
    id: number,
    updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<User> {
    await this.findOne(id);

    await this.usersRepository.update(id, {
      role: updateUserRoleDto.role,
    });

    return this.findOne(id);
  }

  async remove(
    id: number,
    actor: AuthenticatedUser,
  ): Promise<{ message: string }> {
    this.ensureCanManageUser(id, actor);
    await this.findOne(id);
    await this.usersRepository.delete(id);

    return {
      message: `Пользователь с id=${id} удалён`,
    };
  }

  async findUserRecipes(userId: number): Promise<Recipe[]> {
    await this.findOne(userId);

    return this.recipesRepository.find({
      where: { authorId: userId },
      relations: {
        author: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findFollowing(userId: number): Promise<Subscription[]> {
    await this.findOne(userId);

    return this.subscriptionsRepository.find({
      where: { subscriberId: userId },
      relations: {
        targetUser: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findFollowers(userId: number): Promise<Subscription[]> {
    await this.findOne(userId);

    return this.subscriptionsRepository.find({
      where: { targetUserId: userId },
      relations: {
        subscriberUser: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  private async ensureUsernameIsAvailable(username: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new ConflictException('Username уже занят');
    }
  }

  private async ensureEmailIsAvailable(email: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email уже занят');
    }
  }

  private ensureCanManageUser(
    targetUserId: number,
    actor: AuthenticatedUser,
  ): void {
    if (
      actor.role !== UserRole.ADMIN &&
      actor.userId !== targetUserId
    ) {
      throw new ForbiddenException(
        'Недостаточно прав для изменения этого пользователя',
      );
    }
  }
}
