import { Submit } from '../../submits/entities/submit.entity';
import { Assignee } from '../../assignees/entities/assignee.entity';
import { RoomTypeEnum } from './../../etc/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TopicImage } from '../../topic-images/entities/topicImage.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: RoomTypeEnum })
  type: RoomTypeEnum;

  @Column()
  name: string;

  @Column()
  maxSubmitTime: number;

  @Column({ type: 'timestamp' })
  open: Date;

  @Column({ type: 'timestamp' })
  deadline: Date;

  @Column()
  duration: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(() => Assignee, (assignee) => assignee.student)
  assignees: Assignee[];

  @OneToMany(() => Submit, (submit) => submit.room)
  submits: Submit[];

  @OneToMany(() => TopicImage, (topicImage) => topicImage.room, {
    cascade: true,
  })
  topicImages: TopicImage[];

  setType(type: RoomTypeEnum) {
    this.type = type;
    return this;
  }

  setName(name: string) {
    this.name = name;
    return this;
  }

  setMaxSubmitTime(maxSubmitTime: number) {
    this.maxSubmitTime = maxSubmitTime;
    return this;
  }

  setDuration(duration: number) {
    this.duration = duration;
    return this;
  }

  setOpen(open: Date) {
    this.open = open;
    return this;
  }

  setDeadline(deadline: Date) {
    this.deadline = deadline;
    return this;
  }
}
