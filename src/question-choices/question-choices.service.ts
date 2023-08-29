import { Injectable } from '@nestjs/common';
import { CreateQuestionChoiceDto } from './dto/create-question-choice.dto';
import { UpdateQuestionChoiceDto } from './dto/update-question-choice.dto';

@Injectable()
export class QuestionChoicesService {
  create(createQuestionChoiceDto: CreateQuestionChoiceDto) {
    return 'This action adds a new questionChoice';
  }

  findAll() {
    return `This action returns all questionChoices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} questionChoice`;
  }

  update(id: number, updateQuestionChoiceDto: UpdateQuestionChoiceDto) {
    return `This action updates a #${id} questionChoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} questionChoice`;
  }
}
