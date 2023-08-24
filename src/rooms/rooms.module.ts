import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Submit } from 'src/submits/entities/submit.entity';
import { Assignee } from 'src/assignees/entities/assignee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Submit, Assignee])],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
