import { Assignee } from './../assignees/entities/assignee.entity';
import { Room } from './../rooms/entities/room.entity';
import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submit } from 'src/submits/entities/submit.entity';
import { File } from 'src/files/entities/file.entity';
import { TopicImage } from 'src/topic-images/entities/topicImage.entity';
import { GoogleApiModule } from 'src/google-api/google-api.module';
import { Question } from './entities/question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      Room,
      Assignee,
      Submit,
      File,
      TopicImage,
    ]),
    GoogleApiModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
