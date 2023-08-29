import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Submit } from '../../submits/entities/submit.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity()
export class QuestionSubmit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  answer: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Submit, (submit) => submit.questionSubmits)
  submit: Submit;

  @ManyToOne(() => Question)
  question: Question;
}
