import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionChoicesService } from './question-choices.service';
import { CreateQuestionChoiceDto } from './dto/create-question-choice.dto';
import { UpdateQuestionChoiceDto } from './dto/update-question-choice.dto';

@Controller('question-choices')
export class QuestionChoicesController {
  constructor(private readonly questionChoicesService: QuestionChoicesService) {}

  @Post()
  create(@Body() createQuestionChoiceDto: CreateQuestionChoiceDto) {
    return this.questionChoicesService.create(createQuestionChoiceDto);
  }

  @Get()
  findAll() {
    return this.questionChoicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionChoicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionChoiceDto: UpdateQuestionChoiceDto) {
    return this.questionChoicesService.update(+id, updateQuestionChoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionChoicesService.remove(+id);
  }
}
