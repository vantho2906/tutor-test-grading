import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';
import { File } from '../../files/entities/file.entity';

@Entity()
export class TopicImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, (room) => room.topicImages, { onDelete: 'CASCADE' })
  room: Room;

  @OneToOne(() => File, { cascade: true })
  file: File;
}
