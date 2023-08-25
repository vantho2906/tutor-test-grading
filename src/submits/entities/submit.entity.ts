import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';
import { Account } from './../../accounts/entities/account.entity';

@Entity()
export class Submit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  submittedAt: Date;

  @Column({ nullable: true, type: 'float' })
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Account, (student) => student.submits)
  student: Account;

  @ManyToOne(() => Room, (room) => room.submits)
  room: Room;
}
