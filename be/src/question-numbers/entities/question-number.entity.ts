import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';

@Entity()
export class QuestionNumber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @OneToOne(() => Room, (room) => room.questionNumber)
  @JoinColumn()
  room: Room;
}
