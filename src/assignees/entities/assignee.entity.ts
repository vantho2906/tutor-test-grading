import { Room } from '../../rooms/entities/room.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Assignee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account, (account) => account.assignees)
  student: Account;

  @ManyToOne(() => Room, (room) => room.assignees)
  room: Room;
}
