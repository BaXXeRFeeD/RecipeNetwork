import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async subscribe(
    subscriberId: number,
    targetUserId: number,
  ): Promise<Subscription> {
    await this.ensureUserExists(subscriberId);
    await this.ensureUserExists(targetUserId);

    if (subscriberId === targetUserId) {
      throw new ConflictException('Пользователь не может подписаться сам на себя');
    }

    const existingSubscription = await this.subscriptionsRepository.findOne({
      where: {
        subscriberId,
        targetUserId,
      },
    });

    if (existingSubscription) {
      throw new ConflictException('Подписка уже существует');
    }

    const subscription = this.subscriptionsRepository.create({
      subscriberId,
      targetUserId,
    });

    await this.subscriptionsRepository.save(subscription);

    return this.subscriptionsRepository.findOneOrFail({
      where: {
        subscriberId,
        targetUserId,
      },
      relations: {
        subscriberUser: true,
        targetUser: true,
      },
    });
  }

  async unsubscribe(
    subscriberId: number,
    targetUserId: number,
  ): Promise<{ message: string }> {
    const subscription = await this.subscriptionsRepository.findOne({
      where: {
        subscriberId,
        targetUserId,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Подписка не найдена');
    }

    await this.subscriptionsRepository.delete({
      subscriberId,
      targetUserId,
    });

    return {
      message: 'Подписка удалена',
    };
  }

  private async ensureUserExists(userId: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с id=${userId} не найден`);
    }
  }
}