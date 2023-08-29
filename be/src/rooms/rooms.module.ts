import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Submit } from 'src/submits/entities/submit.entity';
import { Assignee } from 'src/assignees/entities/assignee.entity';
import { File } from 'src/files/entities/file.entity';
import { GoogleApiModule } from 'src/google-api/google-api.module';
import { TopicImage } from 'src/topic-images/entities/topicImage.entity';

@Module({
  imports: [
    GoogleApiModule,
    TypeOrmModule.forFeature([Room, Submit, Assignee, File, TopicImage]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
