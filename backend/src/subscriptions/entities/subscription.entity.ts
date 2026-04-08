import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity({ name: 'subscriptions' })
export class Subscription {
  @PrimaryColumn({ name: 'subscriber_id', type: 'int' })
  subscriberId!: number;

  @PrimaryColumn({ name: 'target_user_id', type: 'int' })
  targetUserId!: number;

  @ManyToOne(() => User, (user) => user.subscriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscriber_id' })
  subscriberUser!: User;

  @ManyToOne(() => User, (user) => user.subscribers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'target_user_id' })
  targetUser!: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
