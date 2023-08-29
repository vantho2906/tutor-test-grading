import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuestionSubmitsService } from './question-submits.service';
import { CreateQuestionSubmitDto } from './dto/create-question-submit.dto';
import { UpdateQuestionSubmitDto } from './dto/update-question-submit.dto';

@Controller('question-submits')
export class QuestionSubmitsController {
  constructor(
    private readonly questionSubmitsService: QuestionSubmitsService,
  ) {}

  @Post()
  create(@Body() createQuestionSubmitDto: CreateQuestionSubmitDto) {
    return this.questionSubmitsService.create(createQuestionSubmitDto);
  }

  @Get()
  findAll() {
    return this.questionSubmitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionSubmitsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionSubmitDto: UpdateQuestionSubmitDto,
  ) {
    return this.questionSubmitsService.update(+id, updateQuestionSubmitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionSubmitsService.remove(+id);
  }
}
