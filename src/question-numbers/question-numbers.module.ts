import { Module } from '@nestjs/common';
import { QuestionNumbersService } from './question-numbers.service';
import { QuestionNumbersController } from './question-numbers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { QuestionNumber } from './entities/question-number.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, QuestionNumber])],
  controllers: [QuestionNumbersController],
  providers: [QuestionNumbersService],
})
export class QuestionNumbersModule {}
