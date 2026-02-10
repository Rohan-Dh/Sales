import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'sales' })
export class Sales {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  amountSold: string;

  @Column({ type: 'int' })
  salesCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
