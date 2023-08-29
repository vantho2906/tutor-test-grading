import { Module } from '@nestjs/common';
import { QuestionChoicesService } from './question-choices.service';
import { QuestionChoicesController } from './question-choices.controller';

@Module({
  controllers: [QuestionChoicesController],
  providers: [QuestionChoicesService]
})
export class QuestionChoicesModule {}
