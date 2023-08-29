import { Module } from '@nestjs/common';
import { SubmitsService } from './submits.service';
import { SubmitsController } from './submits.controller';
import { GoogleApiModule } from 'src/google-api/google-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { Submit } from './entities/submit.entity';
import { Assignee } from 'src/assignees/entities/assignee.entity';
import { TopicImage } from 'src/topic-images/entities/topicImage.entity';
import { File } from 'src/files/entities/file.entity';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [
    AccountsModule,
    GoogleApiModule,
    TypeOrmModule.forFeature([Room, Submit, Assignee, File, TopicImage]),
  ],
  controllers: [SubmitsController],
  providers: [SubmitsService],
})
export class SubmitsModule {}
