import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { QuestionNumbersService } from './question-numbers.service';
import { CreateQuestionNumberDto } from './dto/create-question-number.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import ResponseObject from 'src/etc/response-object';

@Controller('question-numbers')
@ApiTags('question-numbers')
export class QuestionNumbersController {
  constructor(
    private readonly questionNumbersService: QuestionNumbersService,
  ) {}

  @Post('create-question-number')
  @ApiBody({ type: CreateQuestionNumberDto, required: true })
  async createQuestionNumber(
    @Body() createQuestionNumberDto: CreateQuestionNumberDto,
  ) {
    const { roomID, quantity } = createQuestionNumberDto;
    const [data, err] = await this.questionNumbersService.createQuestionNumber(
      +roomID,
      +quantity,
    );
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Create question number failed',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Create question number success',
      data,
      null,
    );
  }
}
