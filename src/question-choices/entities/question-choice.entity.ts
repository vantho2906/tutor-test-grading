import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../../questions/entities/question.entity';

@Entity()
export class QuestionChoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  answer: number;

  @ManyToOne(() => Question, (question) => question.questionChoices, {
    onDelete: 'CASCADE',
  })
  question: Question;
}
