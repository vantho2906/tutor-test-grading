import { Injectable } from '@nestjs/common';
import { CreateQuestionSubmitDto } from './dto/create-question-submit.dto';
import { UpdateQuestionSubmitDto } from './dto/update-question-submit.dto';

@Injectable()
export class QuestionSubmitsService {
  create(createQuestionSubmitDto: CreateQuestionSubmitDto) {
    return 'This action adds a new questionSubmit';
  }

  findAll() {
    return `This action returns all questionSubmits`;
  }

  findOne(id: number) {
    return `This action returns a #${id} questionSubmit`;
  }

  update(id: number, updateQuestionSubmitDto: UpdateQuestionSubmitDto) {
    return `This action updates a #${id} questionSubmit`;
  }

  remove(id: number) {
    return `This action removes a #${id} questionSubmit`;
  }
}
