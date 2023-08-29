import { Module } from '@nestjs/common';
import { QuestionSubmitsService } from './question-submits.service';
import { QuestionSubmitsController } from './question-submits.controller';

@Module({
  controllers: [QuestionSubmitsController],
  providers: [QuestionSubmitsService]
})
export class QuestionSubmitsModule {}
