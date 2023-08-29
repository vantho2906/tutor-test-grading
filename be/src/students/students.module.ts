import { Room } from 'src/rooms/entities/room.entity';
import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submit } from 'src/submits/entities/submit.entity';
import { Assignee } from 'src/assignees/entities/assignee.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { Account } from 'src/accounts/entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Room, Submit, Assignee]),
    RoomsModule,
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
