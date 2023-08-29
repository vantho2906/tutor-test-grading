import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';
import { File } from '../../files/entities/file.entity';
import { QuestionChoice } from '../../question-choices/entities/question-choice.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  choiceNumber: number;

  @Column()
  answer: number;

  @ManyToOne(() => Room, (room) => room.questions)
  room: Room;

  @OneToOne(() => File)
  @JoinColumn()
  file: File;

  @OneToMany(
    () => QuestionChoice,
    (questionChoice) => questionChoice.question,
    { cascade: true },
  )
  questionChoices: QuestionChoice[];
}
