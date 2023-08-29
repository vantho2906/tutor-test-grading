import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';
import { Account } from '../../accounts/entities/account.entity';
import { QuestionSubmit } from '../../question-submits/entities/question-submit.entity';

@Entity()
export class Submit {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToMany(() => QuestionSubmit, (questionSubmit) => questionSubmit.submit)
  questionSubmits: QuestionSubmit[];
}
